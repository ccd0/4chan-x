ifdef ComSpec
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

npgoals := clean cleanall $(foreach i,1 2 3 4,bump$(i)) beta stable web
ifneq "$(filter $(npgoals),$(MAKECMDGOALS))" ""
.NOTPARALLEL :
endif

coffee := $(BIN)coffee -c --no-header
coffee_deps := node_modules/coffee-script/package.json
template := node tools/template.js
template_deps := package.json tools/template.js node_modules/lodash/package.json node_modules/esprima/package.json
cat := node tools/cat.js
cat_deps := tools/cat.js

pkg = $(shell node -p "JSON.parse(require('fs').readFileSync('package.json')).$1")
name := $(call pkg,name)
nameHuman := $(call pkg,meta.name)
distBranch := $(call pkg,meta.distBranch)
version := $(shell node -p "JSON.parse(require('fs').readFileSync('version.json')).version")

capitalized = $(filter-out a,$(foreach x,$1,$(subst a $(x),,$(sort a $(x)))))

parts := \
 globals config css platform classes \
 $(sort $(call capitalized, \
  $(subst src/,,$(wildcard src/*)) \
 )) \
 main

lang = $(if $(filter globals css,$1),js,coffee)

# remove extension when sorting so X.coffee comes before X.Y.coffee
sources_lang = \
 $(subst !,.$2,$(sort $(subst .$2,!, \
  $(wildcard src/$1/*.$2))))

sources = $(call sources_lang,$1,$(call lang,$1))

imports = \
 $(filter-out %.coffee %.js,$(wildcard src/$1/*.* src/$1/*/*.* src/$1/*/*/*.*)) \
 .tests_enabled \
 $(imports_$1)

imports_globals := \
 version.json
imports_config := \
 src/Archive/archives.json
imports_css := \
 tools/style.js \
 node_modules/font-awesome/css/font-awesome.css \
 node_modules/font-awesome/fonts/fontawesome-webfont.woff
imports_Monitoring := \
 src/meta/icon128.png

intermediate = \
 LICENSE \
 src/meta/fbegin.js \
 tmp/declaration.js \
 $(foreach p, \
  $(subst platform,platform_$1,$(parts)) \
  ,tmp/$(p).js) \
 src/meta/fend.js

crx_contents := script.js eventPage.js icon16.png icon48.png icon128.png manifest.json

release := \
 $(foreach f, \
  $(foreach c,. -beta.,$(name)$(c)crx updates$(c)xml $(name)$(c)user.js $(name)$(c)meta.js) \
  $(name)-noupdate.crx \
  $(name)-noupdate.user.js \
  $(name).zip \
 ,builds/$(f))

script := $(foreach f,$(filter-out %.crx %.zip,$(release)),test$(f)) $(foreach t,crx crx-beta crx-noupdate,$(foreach f,$(crx_contents),testbuilds/$(t)/$(f)))

crx := $(foreach f,$(filter %.crx %.zip,$(release)),test$(f))

jshint := $(foreach f,$(subst platform,platform_crx platform_userscript,$(parts)),.events/jshint.$(f))

default : script jshint install

all : release jshint install

.events tmp testbuilds builds :
	$(MKDIR)

.events/npm : npm-shrinkwrap.json | .events
	npm install
	echo -> $@

node_modules/% : .events/npm
	

.tests_enabled :
	echo false> .tests_enabled

.events/declare : $(wildcard src/*/*.coffee) tools/declare.js | .events tmp
	node tools/declare.js
	echo -> $@

tmp/declaration.js : .events/declare
	

define concatenate
tmp/$1.jst : $$(call sources,$1) $(cat_deps) | tmp
	$(cat) $$(subst $$$$,$$(ESC_DOLLAR),$$(call sources,$1)) $$@
endef

$(foreach p, \
 $(parts), \
 $(eval $(call concatenate,$(p))) \
)

define interpolate
tmp/$1.$$(call lang,$1) : tmp/$1.jst $$(call imports,$1) $(template_deps)
	$(template) $$< $$@
endef

$(foreach p, \
 $(filter-out platform,$(parts)), \
 $(eval $(call interpolate,$(p))) \
)

tmp/platform_%.coffee : tmp/platform.jst $(call imports,platform) $(template_deps)
	$(template) $< $@ type=$*

define compile
tmp/$1.js : tmp/$1.coffee $(coffee_deps) tools/globalize.js
	$(coffee) $$<
	node tools/globalize.js $1
endef

$(foreach p, \
 $(filter-out globals css platform,$(parts)) platform_crx platform_userscript, \
 $(eval $(call compile,$(p))) \
)

tmp/eventPage.js : src/meta/eventPage.coffee $(coffee_deps) | tmp
	$(coffee) -o tmp src/meta/eventPage.coffee

define rules_channel

testbuilds/crx$1 :
	$$(MKDIR)

testbuilds/crx$1/script.js : $(call intermediate,crx) $(cat_deps) | testbuilds/crx$1
	$(cat) $(call intermediate,crx) $$@

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

testbuilds/$(name)$1.user.js : testbuilds/$(name)$1.meta.js $(call intermediate,userscript) $(cat_deps)
	$(cat) testbuilds/$(name)$1.meta.js $(call intermediate,userscript) $$@

endef

$(eval $(call rules_channel,))
$(eval $(call rules_channel,-beta))
$(eval $(call rules_channel,-noupdate))

testbuilds/$(name).zip : testbuilds/$(name)-noupdate.crx.zip
	$(CP)

builds/% : testbuilds/% | builds
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

.events/install : $(script) install.json tools/install.js | .events
	node tools/install.js
	echo -> $@

.events/CHANGELOG : version.json | .events
	node tools/updcl.js
	echo -> $@

dist :
	git worktree add $@ $(distBranch)

.SECONDARY :

.PHONY: default all script crx release jshint install tag distready $(npgoals)

script : $(script)

crx : $(crx)

release : $(release)

jshint : $(jshint)

install : .events/install

tag : .events/CHANGELOG $(jshint) $(release)
	git commit -am "Release $(name) v$(version)."
	git tag -a $(version) -m "$(name) v$(version)."

distready : | dist
	cd dist && git checkout $(distBranch)
	cd dist && git pull

dist/index.html : test.html distready
	$(CP)

clean :
	$(RMDIR) tmp testbuilds .events dist
	$(RM) .tests_enabled
	git worktree prune

cleanall : clean
	$(RMDIR) builds

$(foreach i,1 2 3 4,bump$(i)) : cleanall
	node tools/bump.js $(subst bump,,$@)
	$(MAKE) tag install

beta : distready
	git tag -af beta -m "$(nameHuman) v$(version)."
	cd dist && git merge --no-commit -s ours beta
	cd dist && git checkout beta "builds/*-beta.*" LICENSE CHANGELOG.md img .gitignore .gitattributes
	cd dist && git commit -am "Move $(nameHuman) v$(version) to beta channel."

stable : distready
	git push . HEAD:bstable
	git tag -af stable -m "$(nameHuman) v$(version)."
	cd dist && git merge --no-commit -s ours stable
	cd dist && git checkout stable "builds/$(name).*" builds/updates.xml
	cd dist && git commit -am "Move $(nameHuman) v$(version) to stable channel."

web : dist/index.html
	cd dist && git merge --no-commit -s ours master
	cd dist && git checkout master README.md web.css img
	cd dist && git commit -am "Update web page."
