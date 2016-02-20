"""
Custom template loader, template and templatetag to handle mustache templates.

PystacheTemplate and Loader are pretty much copies of their parent classes
with one line modifications or so.

do_mustache allows template tags like
{% mustache "main.mustache" %}
and
{% mustache "main.mustache" main_vars %}

where main_vars is a dict containing variables needed by the mustache.

"""

from django import template
from django.conf import settings
from django.template import Template, loader, Engine
from django.template.base import TemplateEncodingError
from django.template.exceptions import TemplateDoesNotExist
try:  # https://github.com/syrusakbary/pyjade/commit/375777a4204c9051f123a040979c3d05a9ec9c70
    from django.template.loader import make_origin
except ImportError:  # Django >= 1.9
    try:
        from django.template import Origin

        def make_origin(display_name, loader, name, dirs):
            return Origin(
                name=display_name,
                template_name=name,
                loader=loader,
            )
    except ImportError:  # Django 1.8.x
        from django.template.engine import Engine
        make_origin = Engine.get_default().make_origi
from django.template.loaders import filesystem
from django.utils.encoding import smart_unicode
from django.template.loaders.base import Loader as bLoader
from pystache import render as pystache_render
from pystache.renderer import Renderer

# https://docs.djangoproject.com/en/1.9/releases/1.4/#extends-template-tag

register = template.Library()


class PystacheTemplate(Template):

    def __init__(self, template_string, origin=None, name='<Unknown Template>'):
        super(PystacheTemplate, self).__init__(template_string, origin, name)
        try:
            template_string = smart_unicode(template_string)
        except:
            raise TemplateEncodingError("Templates can only be constructed from unicode or UTF-8 strings.")
        if settings.TEMPLATE_DEBUG and origin is None:
            origin = template.StringOrigin(template_string)
        self.nodelist = template_string
        self.name = name

    def __iter__(self):
        pass

    def render(self, context):
        return pystache_render(self.nodelist, context, to_str=str)


class Loader(filesystem.Loader):

    def __init__(self, engine):
        super(Loader, self).__init__(engine)

    def get_template_sources(self, template_name, template_dirs=None):
        if not template_name.endswith(".mustache"):
            return []
        else:
            return super(Loader, self).get_template_sources(template_name, template_dirs)

    def load_template(self, template_name, template_dirs=None):
        source, display_name = self.load_template_source(template_name, template_dirs)
        origin = make_origin(display_name, self.load_template_source, template_name, template_dirs)
        try:
            template = PystacheTemplate(source, origin, template_name)
            return template, None
        except TemplateDoesNotExist:
            # If compiling the template we found raises TemplateDoesNotExist,
            # back off to returning the source and display name for the
            # template we were asked to load.
            # This allows for correct identification (later) of the actual
            # template that does not exist.
            return source, display_name


class MustacheNode(template.Node):

    def __init__(self, raw_template, data):
        self.tpl = template.Variable(raw_template)
        if data:
            self.data = template.Variable(data)
        else:
            self.data = None

    def render(self, context):
        if self.data:
            data = self.data.resolve(context)
        else:
            data = {}
        tpl = self.tpl.resolve(context)
        for engine in template.engines.all():
            try:
                origins = []
                for loader in Engine.get_default().template_loaders:
                    if not isinstance(loader, Loader):
                        continue
                    origins = list(loader.get_template_sources("meta.mustache"))
                    break
                else:
                    break
                for origin in origins:
                    try:
                        mustache_code = loader.get_contents(origin)
                        return pystache_render(mustache_code, context=context.get("metadata"))
                    except TemplateDoesNotExist:
                        continue
            except Exception as e:
                continue
        return ""


@register.tag(name="mustache")
def do_mustache(parser, token):
    contents = token.split_contents()
    if len(contents) == 2:
        tag_name, tpl = contents
        data = None
    else:
        tag_name, tpl, data = contents

    return MustacheNode(tpl, data)
