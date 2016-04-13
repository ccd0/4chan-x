name := 4chan-X

ifeq "$(OS)" "Windows_NT"
  BIN := $(subst /,\,node_modules/.bin/)
  RMDIR := -rmdir /s /q
  RM := -del
  CP = copy /y $(subst /,\,$<) $(subst /,\,$@)
  MKDIR = -mkdir $(subst /,\,$@)
else
  BIN := node_modules/.bin/
  RMDIR := rm -rf
  RM := rm -rf
  CP = cp $< $@
  MKDIR = mkdir -p $@
endif

coffee := $(BIN)coffee -c --no-header
coffee_deps := node_modules/coffee-script/package.json
template := node tools/template.js
template_deps := package.json version.json tools/template.js node_modules/lodash/package.json
cat := node tools/cat.js
cat_deps := tools/cat.js
jshint_deps := .jshintrc node_modules/jshint/package.json

parts := top API classes General Filtering Quotelinks Posting Images Linkification Menu Monitoring Archive Miscellaneous bottom

js_parts := $(foreach p,$(subst API,API_crx API_userscript,$(parts)),tmp/parts/$(p).js)

define sorted_dir
sources_$1 := $$(sort $$(wildcard src/$1/*.coffee))
endef

sources_top := \
 src/General/Config.coffee \
 src/General/Globals.coffee

sources_API := \
 src/General/$$.coffee \
 src/General/CrossOrigin.coffee \
 src/Images/ImageCommon.coffee

sources_classes := \
 $(foreach n, \
  Callbacks Board Thread CatalogThread Post Clone DataBoard Notice RandomAccessList SimpleDict ShimSet Connection Fetcher \
 ,src/classes/$(n).coffee)

sources_General := \
 $(foreach n, \
  Polyfill Header Index Build Get UI BuildTest \
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

imports_top := \
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

jshint := $(foreach f,script-crx eventPage script-userscript,.events/jshint.$(f))

jshint_parts := $(foreach p,$(subst API,API_crx API_userscript,$(parts)),.events/jshint_p.$(p))

default : jshint_parts install

all : jshint bds install

.events tmp tmp/parts testbuilds builds :
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

define rules_part

tmp/parts/$1.jst : $$(sources_$1) $(cat_deps) | tmp/parts
	$(cat) $$(sources_$1) $$@

tmp/parts/$1.coffee : tmp/parts/$1.jst $$(filter-out %.coffee,$$(wildcard src/$1/*.* src/$1/*/*.* src/$1/*/*/*.*)) $$(imports_$1) .tests_enabled $(template_deps)
	$(template) $$< $$@

tmp/parts/$1.js : tmp/parts/$1.coffee $(coffee_deps)
	$(coffee) $$<

endef

$(foreach i,$(parts),$(eval $(call rules_part,$(i))))

tmp/parts/API_%.coffee : tmp/parts/API.jst $(template_deps)
	$(template) $< $@ type=$*

tmp/parts/API_%.js : tmp/parts/API_%.coffee $(coffee_deps)
	$(coffee) $<

tmp/script-crx.js : $(filter-out tmp/parts/API_userscript.js,$(js_parts)) tools/cat-coffee.js
	node tools/cat-coffee.js $(filter-out tmp/parts/API_userscript.js,$(js_parts)) $@

tmp/script-userscript.js : $(filter-out tmp/parts/API_crx.js,$(js_parts)) tools/cat-coffee.js
	node tools/cat-coffee.js $(filter-out tmp/parts/API_crx.js,$(js_parts)) $@

tmp/eventPage.js : src/General/eventPage.coffee $(coffee_deps) | tmp
	$(coffee) -o tmp src/General/eventPage.coffee

define rules_channel

testbuilds/crx$1 :
	$$(MKDIR)

testbuilds/crx$1/script.js : src/meta/botproc.js LICENSE src/meta/usestrict.js tmp/script-crx.js $(cat_deps) | testbuilds/crx$1
	$(cat) src/meta/botproc.js LICENSE src/meta/usestrict.js tmp/script-crx.js $$@

testbuilds/crx$1/eventPage.js : tmp/eventPage.js | testbuilds/crx$1
	$$(CP)

testbuilds/crx$1/icon%.png : src/meta/icon%.png | testbuilds/crx$1
	$$(CP)

testbuilds/crx$1/manifest.json : src/meta/manifest.json $(template_deps) | testbuilds/crx$1
	$(template) $$< $$@ type=crx channel=$1

testbuilds/updates$1.xml : src/meta/updates.xml $(template_deps) | testbuilds/crx$1
	$(template) $$< $$@ type=crx channel=$1

testbuilds/$(name)$1.crx.zip : \
 $(foreach f,$(crx_contents),testbuilds/crx$1/$(f)) \
 package.json version.json tools/zip-crx.js node_modules/jszip/package.json
	node tools/zip-crx.js $1

testbuilds/$(name)$1.crx : testbuilds/$(name)$1.crx.zip package.json tools/sign.js node_modules/crx/package.json
	node tools/sign.js $1

testbuilds/$(name)$1.meta.js : src/meta/metadata.js src/meta/icon48.png $(template_deps) | testbuilds
	$(template) $$< $$@ type=userscript channel=$1

testbuilds/$(name)$1.user.js : src/meta/botproc.js testbuilds/$(name)$1.meta.js LICENSE src/meta/usestrict.js tmp/script-userscript.js $(cat_deps)
	$(cat) src/meta/botproc.js testbuilds/$(name)$1.meta.js LICENSE src/meta/usestrict.js tmp/script-userscript.js $$@

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

tmp/parts/.jshintrc : src/meta/jshint.json $(template_deps) | tmp/parts
	$(template) $< $@ stage=parts

.jshintrc : src/meta/jshint.json $(template_deps)
	$(template) $< $@ stage=full

.events/jshint.% : tmp/%.js .jshintrc node_modules/jshint/package.json | .events
	$(BIN)jshint $<
	echo -> $@

.events/jshint_p.% : tmp/parts/%.js tmp/parts/.jshintrc node_modules/jshint/package.json | .events
	$(BIN)jshint $<
	echo -> $@

install.json :
	echo {}> $@

.events/install : $(testbds) install.json tools/install.js | .events
	node tools/install.js
	echo -> $@

.SECONDARY :

.PHONY: default all clean cleanall testbds bds jshint jshint_parts install

clean :
	$(RMDIR) tmp testbuilds .events
	$(RM) .jshintrc .tests_enabled

cleanall : clean
	$(RMDIR) builds

testbds : $(testbds)

testcrx : $(testcrx)

bds : $(bds)

jshint : $(jshint)

jshint_parts : $(jshint_parts)

install : .events/install
