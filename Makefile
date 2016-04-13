name := 4chan-X

ifeq "$(OS)" "Windows_NT"
  BIN := $(subst /,\,node_modules/.bin/)
  RMDIR := -rmdir /s /q
  RM := -del
  CP = copy /y $(subst /,\,$<) $(subst /,\,$@)
  MKDIR = -mkdir $(subst /,\,$@)
  ESC_DOLLAR = $$
else
  BIN := node_modules/.bin/
  RMDIR := rm -rf
  RM := rm -rf
  CP = cp $< $@
  MKDIR = mkdir -p $@
  ESC_DOLLAR = \$$
endif

coffee := $(BIN)coffee -c --no-header
coffee_deps := node_modules/coffee-script/package.json
template := node tools/template.js
template_deps := package.json tools/template.js node_modules/lodash/package.json
cat := node tools/cat.js
cat_deps := tools/cat.js

parts := Config API classes General Filtering Quotelinks Posting Images Linkification Menu Monitoring Archive Miscellaneous bottom

intermediate := LICENSE src/meta/fbegin.js tmp/declaration.js tmp/globals.js $(foreach p,$(parts),tmp/$(p).js) src/meta/fend.js

define sorted_dir
sources_$1 := $$(sort $$(wildcard src/$1/*.coffee))
endef

sources_Config := \
 src/General/Config.coffee

sources_API := \
 src/General/$$.coffee \
 src/General/$$$$.coffee \
 src/General/CrossOrigin.coffee \
 src/Images/ImageCommon.coffee

sources_classes := \
 $(foreach n, \
  Callbacks Board Thread CatalogThread Post Clone DataBoard Notice RandomAccessList SimpleDict ShimSet Connection Fetcher \
 ,src/classes/$(n).coffee)

sources_General := \
 $(foreach n, \
  Polyfill Header Index Build Get UI Build.Test \
 ,src/General/$(n).coffee)

$(foreach d, \
 Filtering Quotelinks \
 ,$(eval $(call sorted_dir,$(d))))

sources_Posting := \
 src/Posting/QR.coffee \
 src/Posting/Captcha.coffee \
 $(sort $(wildcard src/Posting/Captcha.*.coffee)) \
 src/Posting/PassLink.coffee \
 src/Posting/PostSuccessful.coffee \
 $(sort $(wildcard src/Posting/QR.*.coffee))

sources_Images := \
 $(sort $(filter-out %/ImageCommon.coffee,$(wildcard src/Images/*.coffee)))

$(foreach d, \
 Linkification Menu Monitoring Archive Miscellaneous \
S ,$(eval $(call sorted_dir,$(d))))

sources_bottom := \
 src/General/Settings.coffee \
 src/General/Main.coffee

imports_Config := \
 src/Archive/archives.json \
 src/css/custom.css
imports_Monitoring := \
 src/meta/icon128.png
imports_Miscellaneous := \
 src/css/report.css
imports_bottom := \
 $(wildcard src/General/Settings/*.html) \
 $(filter-out src/css/custom.css src/css/report.css,$(wildcard src/css/*.css)) \
 tmp/font-awesome.css \
 tmp/style.css

imports_font_awesome := \
 node_modules/font-awesome/css/font-awesome.css \
 node_modules/font-awesome/fonts/fontawesome-webfont.woff
imports_style := \
 $(wildcard src/Linkification/icons/*.png)

crx_contents := script.js eventPage.js icon16.png icon48.png icon128.png manifest.json

bds := \
 $(foreach f, \
  $(foreach c,. -beta.,$(name)$(c)crx updates$(c)xml $(name)$(c)user.js $(name)$(c)meta.js) \
  $(name)-noupdate.crx \
  $(name)-noupdate.user.js \
  $(name).zip \
 ,builds/$(f))

testbds := $(foreach f,$(filter-out %.crx %.zip,$(bds)),test$(f)) $(foreach t,crx crx-beta crx-noupdate,$(foreach f,$(crx_contents),testbuilds/$(t)/$(f)))

testcrx := $(foreach f,$(filter %.crx %.zip,$(bds)),test$(f))

jshint := $(foreach f,globals $(subst API,API_crx API_userscript,$(parts)),.events/jshint.$(f))

default : jshint install

all : jshint bds install

.events tmp testbuilds builds :
	$(MKDIR)

.events/npm : npm-shrinkwrap.json | .events
	npm install
	echo -> $@

node_modules/% : .events/npm
	

.tests_enabled :
	echo false> .tests_enabled

tmp/font-awesome.css : src/css/font-awesome.css $(imports_font_awesome) $(template_deps) | tmp
	$(template) $< $@

tmp/style.css : src/css/style.css $(imports_style) $(template_deps) | tmp
	$(template) $< $@

tmp/declaration.js : $(wildcard src/*/*.coffee) tools/declare.js | tmp
	node tools/declare.js

tmp/globals.js : src/General/globals.js version.json $(template_deps) | tmp
	$(template) $< $@

define rules_part

tmp/$1.jst : $$(sources_$1) $(cat_deps) | tmp
	$(cat) $$(sources_$1) $$@

tmp/$1.coffee : tmp/$1.jst $$(filter-out %.coffee,$$(wildcard src/$1/*.* src/$1/*/*.* src/$1/*/*/*.*)) $$(imports_$1) .tests_enabled $(template_deps)
	$(template) $$< $$@

tmp/$1.js : tmp/$1.coffee $(coffee_deps) tools/globalize.js
	$(coffee) $$<
	node tools/globalize.js $$@ $$(sources_$1)

endef

$(foreach i,$(filter-out API,$(parts)),$(eval $(call rules_part,$(i))))

tmp/API.jst : $(sources_API) $(cat_deps) | tmp
	$(cat) $(subst $$,$(ESC_DOLLAR),$(sources_API)) $@

tmp/API_%.coffee : tmp/API.jst $(template_deps)
	$(template) $< $@ type=$*

tmp/API_%.js : tmp/API_%.coffee $(coffee_deps)
	$(coffee) $<
	node tools/globalize.js $@ $(subst $$,$(ESC_DOLLAR),$(sources_API))

tmp/eventPage.js : src/General/eventPage.coffee $(coffee_deps) | tmp
	$(coffee) -o tmp src/General/eventPage.coffee

define rules_channel

testbuilds/crx$1 :
	$$(MKDIR)

testbuilds/crx$1/script.js : src/meta/botproc.js $(subst API,API_crx,$(intermediate)) $(cat_deps) | testbuilds/crx$1
	$(cat) src/meta/botproc.js $(subst API,API_crx,$(intermediate)) $$@

testbuilds/crx$1/eventPage.js : tmp/eventPage.js | testbuilds/crx$1
	$$(CP)

testbuilds/crx$1/icon%.png : src/meta/icon%.png | testbuilds/crx$1
	$$(CP)

testbuilds/crx$1/manifest.json : src/meta/manifest.json version.json $(template_deps) | testbuilds/crx$1
	$(template) $$< $$@ type=crx channel=$1

testbuilds/updates$1.xml : src/meta/updates.xml version.json $(template_deps) | testbuilds/crx$1
	$(template) $$< $$@ type=crx channel=$1

testbuilds/$(name)$1.crx.zip : \
 $(foreach f,$(crx_contents),testbuilds/crx$1/$(f)) \
 package.json version.json tools/zip-crx.js node_modules/jszip/package.json
	node tools/zip-crx.js $1

testbuilds/$(name)$1.crx : testbuilds/$(name)$1.crx.zip package.json tools/sign.js node_modules/crx/package.json
	node tools/sign.js $1

testbuilds/$(name)$1.meta.js : src/meta/metadata.js src/meta/icon48.png version.json $(template_deps) | testbuilds
	$(template) $$< $$@ type=userscript channel=$1

testbuilds/$(name)$1.user.js : src/meta/botproc.js testbuilds/$(name)$1.meta.js $(subst API,API_userscript,$(intermediate)) $(cat_deps)
	$(cat) src/meta/botproc.js testbuilds/$(name)$1.meta.js $(subst API,API_userscript,$(intermediate)) $$@

endef

$(eval $(call rules_channel,))
$(eval $(call rules_channel,-beta))
$(eval $(call rules_channel,-noupdate))

testbuilds/$(name).zip : testbuilds/$(name)-noupdate.crx.zip
	$(CP)

builds/% : testbuilds/% $(jshint) | builds
	$(CP)

test.html : README.md template.jst tools/markdown.js node_modules/marked/package.json node_modules/lodash/package.json
	node tools/markdown.js

tmp/.jshintrc : src/meta/jshint.json tmp/declaration.js tmp/globals.js $(template_deps) | tmp
	$(template) $< $@

.events/jshint.% : tmp/%.js tmp/.jshintrc node_modules/jshint/package.json | .events
	$(BIN)jshint $<
	echo -> $@

install.json :
	echo {}> $@

.events/install : $(testbds) install.json tools/install.js | .events
	node tools/install.js
	echo -> $@

.SECONDARY :

.PHONY: default all clean cleanall testbds bds jshint install

clean :
	$(RMDIR) tmp testbuilds .events
	$(RM) .tests_enabled

cleanall : clean
	$(RMDIR) builds

testbds : $(testbds)

testcrx : $(testcrx)

bds : $(bds)

jshint : $(jshint)

install : .events/install
