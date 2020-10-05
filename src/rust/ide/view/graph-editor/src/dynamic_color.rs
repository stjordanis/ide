use crate::prelude::*;

use enso_frp as frp;
use enso_frp;

use ensogl::application::Application;
use ensogl::data::color;
use ensogl::display::shape::*;
use ensogl::display::style::path::Path;

use ensogl_text;
use ensogl::gui::component::Animation;
use ensogl_theme as theme;
use ensogl::display::style::data::DataMatch;



// =================
// === Constants ===
// =================

const DEFAULT_COLOR    : color::Rgba = color::Rgba::new(1.0, 0.0, 0.0, 0.5);
const THEME_KEY_DIMMED : &str = " dimmed";



// ====================
// === Color Mixing ===
// ====================

fn lerp(a:f32, b:f32, value:f32) -> f32 {
    b * value + a * (1.0-value )
}

fn mix<T1:Into<color::Lcha>,T2:Into<color::Lcha>>(color_a:T1,color_b:T2,mix_value:f32) -> color::Lcha {
    let color_a   = color_a.into();
    let color_b   = color_b.into();
    let lightness = lerp(color_a.lightness,color_b.lightness,mix_value);
    let chroma    = lerp(color_a.chroma,color_b.chroma,mix_value);
    // TODO check whether hue needs to be done differently for shortest path
    let hue       = lerp(color_a.hue,color_b.hue,mix_value);
    let alpha     = lerp(color_a.alpha,color_b.alpha,mix_value);
    color::Lcha::new(lightness,chroma,hue,alpha)
}



// ====================
// === Color Source ===
// ====================

#[derive(Clone,Debug)]
pub enum Source {
    Static { color : color::Rgba},
    Theme  { path  : Path}
}

impl Default for Source {
    fn default() -> Self {
        Source::Static{color:DEFAULT_COLOR}
    }
}

impl From<color::Rgba> for Source {
    fn from(color:color::Rgba) -> Self {
        Source::Static {color}
    }
}

impl From<Path> for Source {
    fn from(path:Path) -> Self {
        Source::Theme {path}
    }
}




// ===================
// === Color State ===
// ===================

#[derive(Clone,Copy,Debug)]
pub enum State {
    Base,
    Dim,
    // TODO consider adding highlight/focused
    // Highlight
}

impl Default for State {
    fn default() -> Self {
        State::Base
    }
}


// ===========
// === Frp ===
// ===========


ensogl_text::define_endpoints! {
    Input {
        set_source (Source),
        set_state  (State),
    }
    Output {
        color                (color::Rgba),
    }
}



// =============
// === Model ===
// =============

#[derive(Clone,Debug)]
struct Model {
    color_source: RefCell<Source>,
    // FIXME : Replace style watch when #795 is resolved with whatever replaces it.
    styles      : StyleWatch
}

impl Model {
    fn new(app:&Application) -> Self {
        let color_path  = default();
        let styles      = StyleWatch::new(&app.display.scene().style_sheet);
        Self{ color_source: color_path,styles}
    }

    fn set_source(&self, source:Source) {
        self.color_source.replace(source);
    }

    fn variant_path(path:Path, extension:String) -> Path {
        let segments_rev = path.rev_segments;
        let mut segments = segments_rev.into_iter().rev().collect_vec();
        segments.pop();
        segments.push(" variant ".to_string());
        segments.push(extension);
        Path::from_segments(segments)
    }

    fn try_get_color_variant_from_theme(&self, id:&str) -> Option<color::Rgba> {
        if let Source::Theme{ path } = self.color_source.borrow().clone() {
            let path  = Self::variant_path(path,id.to_string());
            let color = self.styles.get(path).color()?;
            Some(color::Rgba::from(color))
        } else {
            None
        }
    }

    fn get_base_color(&self) -> color::Rgba {
        match self.color_source.borrow().clone() {
            Source::Static{color} => color,
            Source::Theme{path}   => self.styles.get_color(path).into(),
        }
    }

    fn make_dimmed_color(&self, color:color::Rgba) -> color::Rgba {
        let color : color::Lcha    = color.into();
        let color_lightness_factor = theme::vars::graph_editor::colors::default::dimming::lightness_factor;
        let color_chroma_factor = theme::vars::graph_editor::colors::default::dimming::chroma_factor;
        let color_lightness_factor = self.styles.get_number_or(color_lightness_factor,0.0);
        let color_chroma_factor    = self.styles.get_number_or(color_chroma_factor,0.0);
        let lightness              = color.lightness * color_lightness_factor;
        let chroma                 = color.chroma * color_chroma_factor;
        let color                  = color::Lcha::new(lightness,chroma,color.hue,color.alpha);
        color.into()
    }

    fn get_color_dimmed(&self, dimmnes:f32) -> color::Rgba {
        let base_color = self.get_base_color();
        let dimmed_color = match self.try_get_color_variant_from_theme(THEME_KEY_DIMMED) {
            None        => self.make_dimmed_color(base_color),
            Some(color) => color,
        };
        mix(base_color,dimmed_color,dimmnes).into()
    }
}



// =====================
// === Dynamic Color ===
// =====================

#[derive(Clone,CloneRef,Debug)]
pub struct DynamicColor {
    pub frp   : Frp,
        model : Rc<Model>,
}


impl DynamicColor {

    pub fn new(app: &Application) -> Self {
        let frp   = Frp::new_network();
        let model = Rc::new(Model::new(app));
        Self{frp,model}.init()
    }

    fn init(self) -> Self {
        let network = &self.frp.network;
        let frp     = &self.frp;
        let model   = &self.model;

        let dimmnes          = Animation::<f32>::new(&network);

        frp::extend! { network
            eval frp.set_state([dimmnes] (state) {
                match *state {
                    State::Base => {
                        dimmnes.set_target_value(0.0);
                    },
                    State::Dim => {
                        dimmnes.set_target_value(1.0);
                    }
                }
            });

            color_parameters <- all(frp.set_source,dimmnes.value);
            color <- color_parameters.map(f!([model]((source,value)){
                  model.set_source(source.clone());
                  model.get_color_dimmed(*value)
            }));
            frp.source.color <+ color;
        }
        self
    }
}
