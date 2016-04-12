name := 4chan-X

ifeq "$(OS)" "Windows_NT"
  BIN := $(subst /,\,node_modules/.bin/)
  RMDIR := -rmdir /s /q
  RM := -del
  CP = mkdir $(subst /,\,$(dir $@)) & copy /y $(subst /,\,$<) $(subst /,\,$@)
else
  BIN := node_modules/.bin/
  RMDIR := rm -rf
  RM := rm -rf
  CP = mkdir -p $(dir $@) && cp $< $@
endif

coffee := $(BIN)coffee -c --no-header
coffee_deps := node_modules/coffee-script/package.json
template := $(BIN)coffee tools/templates.coffee
template_deps := \
 package.json version.json \
 tools/templates.coffee \
 node_modules/coffee-script/package.json node_modules/fs-extra/package.json node_modules/lodash/package.json
cat := node tools/cat.js
cat_deps := tools/cat.js node_modules/fs-extra/package.json
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
 src/classes/Set.coffee \
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
 $(sort $(wildcard src/Miscellaneous/*.coffee)) \
 src/General/Settings.coffee \
 src/General/Main.coffee

imports := \
 node_modules/font-awesome/package.json \
 $(wildcard src/Linkification/icons/*.png) \
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

builds := \
 $(foreach f, \
  $(foreach c,. -beta.,$(name)$(c)crx updates$(c)xml $(name)$(c)user.js $(name)$(c)meta.js) \
  $(name)-noupdate.crx \
  $(name)-noupdate.user.js \
  $(name).zip \
 ,builds/$(f))

testbuilds := $(foreach f,$(subst .crx,.crx.zip,$(builds)),test$(f))

jshint := $(foreach f,script-crx eventPage script-userscript,.events/jshint.$(f))

default : install

all : builds install

.events :
	mkdir $@

.events/npm : npm-shrinkwrap.json | .events
	npm install
	echo -> $@

node_modules/%/package.json : .events/npm
	

.tests_enabled :
	echo false> .tests_enabled

tmp/script.coffee : $(sources) $(cat_deps)
	$(cat) $(sources) $@

tmp/script-%.coffee : tmp/script.coffee $(imports) $(template_deps)
	$(template) $< $@ type=$*

tmp/script-%.js : tmp/script-%.coffee $(coffee_deps)
	$(coffee) $<

tmp/eventPage.js : src/General/eventPage.coffee $(coffee_deps)
	$(coffee) -o tmp src/General/eventPage.coffee

define rules_channel

testbuilds/crx$1/script.js : src/meta/botproc.js LICENSE src/meta/usestrict.js tmp/script-crx.js $(cat_deps)
	$(cat) src/meta/botproc.js LICENSE src/meta/usestrict.js tmp/script-crx.js $$@

testbuilds/crx$1/eventPage.js : tmp/eventPage.js
	$$(CP)

testbuilds/crx$1/icon%.png : src/meta/icon%.png
	$$(CP)

testbuilds/crx$1/manifest.json : src/meta/manifest.json $(template_deps)
	$(template) $$< $$@ type=crx channel=$1

testbuilds/updates$1.xml : src/meta/updates.xml $(template_deps)
	$(template) $$< $$@ type=crx channel=$1

testbuilds/$(name)$1.crx.zip : \
 $(foreach f,script.js eventPage.js icon16.png icon48.png icon128.png manifest.json,testbuilds/crx$1/$(f)) \
 package.json version.json tools/zip-crx.js node_modules/jszip/package.json
	node tools/zip-crx.js $1

testbuilds/$(name)$1.crx : testbuilds/$(name)$1.crx.zip package.json tools/sign.js node_modules/crx/package.json
	node tools/sign.js $1

testbuilds/$(name)$1.meta.js : src/meta/metadata.js src/meta/icon48.png $(template_deps)
	$(template) $$< $$@ type=userscript channel=$1

testbuilds/$(name)$1.user.js : src/meta/botproc.js testbuilds/$(name)$1.meta.js LICENSE src/meta/usestrict.js tmp/script-userscript.js $(cat_deps)
	$(cat) src/meta/botproc.js testbuilds/$(name)$1.meta.js LICENSE src/meta/usestrict.js tmp/script-userscript.js $$@

endef

$(eval $(call rules_channel,))
$(eval $(call rules_channel,-beta))
$(eval $(call rules_channel,-noupdate))

testbuilds/$(name).zip : testbuilds/$(name)-noupdate.crx.zip
	$(CP)

builds/% : testbuilds/% $(jshint)
	$(CP)

test.html : README.md template.jst tools/markdown.js node_modules/marked/package.json node_modules/lodash/package.json
	node tools/markdown.js

.jshintrc : tools/templates.coffee src/meta/jshint.json $(template_deps)
	$(template) src/meta/jshint.json .jshintrc

.events/jshint.% : tmp/%.js $(jshint_deps) | .events
	$(BIN)jshint $<
	echo -> $@

install.json :
	echo {}> $@

.events/install : $(testbuilds) $(jshint) install.json tools/install.js node_modules/fs-extra/package.json | .events
	node tools/install.js
	echo -> $@

.SECONDARY :

.PHONY: default all clean cleanall testbuilds builds jshint install

clean :
	$(RMDIR) tmp testbuilds .events
	$(RM) .jshintrc .tests_enabled

cleanall : clean
	$(RMDIR) builds

testbuilds : $(testbuilds)

builds : $(builds)

jshint : $(jshint)

install : .events/install
