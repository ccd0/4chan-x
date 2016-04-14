name := 4chan-X

ifdef ComSpec
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

sources := \
 src/General/Config.coffee \
 src/General/Globals.coffee \
 src/General/$$.coffee \
 src/classes/Callbacks.coffee \
 src/classes/Board.coffee \
 src/classes/Thread.coffee \
 src/classes/CatalogThread.coffee \
 src/classes/Post.coffee \
 src/classes/Clone.coffee \
 src/classes/DataBoard.coffee \
 src/classes/Notice.coffee \
 src/classes/RandomAccessList.coffee \
 src/classes/SimpleDict.coffee \
 src/classes/ShimSet.coffee \
 src/classes/Connection.coffee \
 src/classes/Fetcher.coffee \
 src/General/Polyfill.coffee \
 src/General/Header.coffee \
 src/General/Index.coffee \
 src/General/Build.coffee \
 src/General/Get.coffee \
 src/General/UI.coffee \
 src/General/CrossOrigin.coffee \
 src/General/BuildTest.coffee \
 $(sort $(wildcard src/Filtering/*.coffee)) \
 $(sort $(wildcard src/Quotelinks/*.coffee)) \
 src/Posting/QR.coffee \
 src/Posting/Captcha.coffee \
 $(sort $(wildcard src/Posting/Captcha.*.coffee)) \
 src/Posting/PassLink.coffee \
 src/Posting/PostSuccessful.coffee \
 $(sort $(wildcard src/Posting/QR.*.coffee)) \
 $(sort $(wildcard src/Images/*.coffee)) \
 $(sort $(wildcard src/Linkification/*.coffee)) \
 $(sort $(wildcard src/Menu/*.coffee)) \
 $(sort $(wildcard src/Monitoring/*.coffee)) \
 $(sort $(wildcard src/Archive/*.coffee)) \
 src/Miscellaneous/PSAHiding.coffee \
 $(filter-out src/Miscellaneous/PSAHiding.coffee,$(sort $(wildcard src/Miscellaneous/*.coffee))) \
 src/General/Settings.coffee \
 src/General/Main.coffee

imports := \
 tmp/font-awesome.css \
 tmp/style.css \
 src/Archive/archives.json \
 src/meta/icon48.png \
 $(wildcard src/Monitoring/Favicon/*/*.png) \
 src/Monitoring/Favicon/dead.gif \
 src/meta/icon128.png \
 src/Monitoring/beep.wav \
 src/Miscellaneous/banners.json \
 $(wildcard src/*/*.html) \
 $(wildcard src/*/*/*.html) \
 $(wildcard src/css/*.css) \
 .tests_enabled

imports_font_awesome := \
 node_modules/font-awesome/package.json
imports_style := \
 $(wildcard src/Linkification/icons/*.png)

bds := \
 $(foreach f, \
  $(foreach c,. -beta.,$(name)$(c)crx updates$(c)xml $(name)$(c)user.js $(name)$(c)meta.js) \
  $(name)-noupdate.crx \
  $(name)-noupdate.user.js \
  $(name).zip \
 ,builds/$(f))

testbds := $(foreach f,$(subst .crx,.crx.zip,$(bds)),test$(f))

jshint := $(foreach f,script-crx eventPage script-userscript,.events/jshint.$(f))

default : jshint install

all : jshint bds install

.events tmp testbuilds builds :
	$(MKDIR)

.events/npm.% : npm-shrinkwrap.json | .events
	npm install $*
	echo -> $@

node_modules/%/package.json : .events/npm.%
	

.tests_enabled :
	echo false> .tests_enabled

tmp/font-awesome.css : src/css/font-awesome.css $(imports_font_awesome) $(template_deps) | tmp
	$(template) $< $@

tmp/style.css : src/css/style.css $(imports_style) $(template_deps) | tmp
	$(template) $< $@

tmp/script.coffee : $(sources) $(cat_deps) | tmp
	$(cat) $(sources) $@

tmp/script-%.coffee : tmp/script.coffee $(imports) $(template_deps)
	$(template) $< $@ type=$*

tmp/script-%.js : tmp/script-%.coffee $(coffee_deps)
	$(coffee) $<

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
 $(foreach f,script.js eventPage.js icon16.png icon48.png icon128.png manifest.json,testbuilds/crx$1/$(f)) \
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

.jshintrc : src/meta/jshint.json $(template_deps)
	$(template) $< .jshintrc

.events/jshint.% : tmp/%.js $(jshint_deps) | .events
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
	$(RM) .jshintrc .tests_enabled

cleanall : clean
	$(RMDIR) builds

testbds : $(testbds)

bds : $(bds)

jshint : $(jshint)

install : .events/install
