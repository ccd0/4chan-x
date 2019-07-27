ifdef ComSpec
  BIN := $(subst /,\,node_modules/.bin/)
  RMDIR := -rmdir /s /q
  RM := -del
  CAT = type $(subst /,\,$1) > $(subst /,\,$2) 2>NUL
  MKDIR = -mkdir $(subst /,\,$@)
  QUOTE = $(patsubst %,"%",$1)
else
  BIN := node_modules/.bin/
  RMDIR := rm -rf
  RM := rm -rf
  CAT = cat $1 > $2
  MKDIR = mkdir -p $@
  QUOTE = $(patsubst %,'%',$1)
endif
CP = $(call CAT,$<,$@)

npgoals := clean cleanrel cleanweb cleanfull withtests archives $(foreach i,1 2 3 4,bump$(i)) tag tagcommit beta stable web update updatehard
ifneq "$(filter $(npgoals),$(MAKECMDGOALS))" ""
.NOTPARALLEL :
endif

coffee := $(BIN)coffee -c --no-header
template := node tools/template.js
template_deps := package.json tools/template.js

# read name meta_name meta_distBranch
$(eval $(shell node tools/pkgvars.js))

# must be read in when needed to prevent out-of-date version
version = $(shell node -p "JSON.parse(require('fs').readFileSync('version.json')).version")

source_directories := \
 globals config css platform classes site \
 Archive Filtering General Images Linkification \
 Menu Miscellaneous Monitoring Posting Quotelinks \
 main

# remove extension when sorting so X.coffee comes before X.Y.coffee
sort_directory = \
 $(subst !c,.coffee,$(subst !j,.js,$(sort $(subst .coffee,!c,$(subst .js,!j, \
  $(wildcard src/$1/*.coffee src/$1/*.js))))))

sources := $(foreach d,$(source_directories),$(call sort_directory,$(d)))

uses_tests_enabled := \
 src/classes/Post.coffee \
 src/site/SW.tinyboard.coffee \
 src/General/Test.coffee \
 src/Linkification/Linkify.coffee \
 src/Miscellaneous/Keybinds.coffee \
 src/Monitoring/Unread.coffee \
 src/main/Main.coffee

imports_src/globals/globals.js := \
 version.json
imports_src/css/CSS.js := \
 node_modules/font-awesome/fonts/fontawesome-webfont.woff
imports_src/Monitoring/Favicon.coffee := \
 src/meta/icon128.png

imports = \
 $(filter-out %.coffee %.js,$(wildcard $(dir $1)*.*)) \
 $(wildcard $(basename $1)/*.*) \
 $(if $(filter $(uses_tests_enabled),$1),.tests_enabled) \
 $(imports_$1)

dests_platform = $(addprefix tmp/,$(subst /,-,$(patsubst src/%,%.js,$(subst platform,platform_$2,$1))))

dests_of = $(sort $(call dests_platform,$1,crx) $(call dests_platform,$1,userscript))

dests := $(foreach s,$(sources),$(call dests_of,$(s)))

updates := $(subst tmp/,.events/,$(dests))

pieces = \
 tmp/LICENSE \
 tmp/meta-newline.js \
 tmp/meta-fbegin.js \
 tmp/meta-newline.js \
 tmp/declaration.js \
 tmp/meta-newline.js \
 $(foreach s,$(sources),$(call dests_platform,$(s),$1)) \
 tmp/meta-fend.js

crx_contents := script.js eventPage.js icon16.png icon48.png icon128.png manifest.json

release := \
 $(foreach f, \
  $(foreach c,. -beta.,$(name)$(c)crx updates$(c)xml updates$(c)json $(name)$(c)user.js $(name)$(c)meta.js) \
  $(name)-noupdate.crx \
  $(name)-noupdate.user.js \
  $(name).zip \
 ,builds/$(f))

script := $(foreach f,$(filter-out %.crx %.zip,$(release)),test$(f)) $(foreach t,crx crx-beta crx-noupdate,$(foreach f,$(crx_contents),testbuilds/$(t)/$(f)))

crx := $(foreach f,$(filter %.crx %.zip,$(release)),test$(f))

default : script jshint install

all : default release

.events .events2 tmp testbuilds builds :
	$(MKDIR)

.tests_enabled :
	echo false> .tests_enabled

.events/declare : $(wildcard src/*/*.coffee) tools/declare.js | .events tmp
	node tools/declare.js
	echo -> $@

tmp/declaration.js : .events/declare
	$(if $(wildcard $@),,node tools/declare.js && echo -> $<)

define check_source
$$(subst tmp/,.events/,$(call dests_of,$1)) : $1 $$(call imports,$1) | .events
	echo -> $$(call QUOTE,$$@)
endef

$(foreach s,$(sources),$(eval $(call check_source,$(subst $$,$$$$,$(s)))))

.events/compile : $(updates) $(template_deps) tools/chain.js
	node tools/chain.js $(call QUOTE, \
	  $(subst .events/,tmp/, \
	   $(if $(filter-out $(updates),$?), \
	    $(updates), \
	    $(filter $(updates),$?) \
	   ) \
	  ) \
	 )
	echo -> $@

$(dests) : .events/compile
	$(if $(wildcard $@),, \
	 node tools/chain.js $(call QUOTE, $(filter-out $(wildcard $(dests)),$(dests))) \
	 && echo -> $< \
	)

tmp/eventPage.js : src/meta/eventPage.coffee | tmp
	$(coffee) -o tmp src/meta/eventPage.coffee

tmp/LICENSE : LICENSE tools/newlinefix.js | tmp
	node tools/newlinefix.js $< $@

tmp/meta-%.js : src/meta/%.js tools/newlinefix.js | tmp
	node tools/newlinefix.js $< $@

define rules_channel

testbuilds/crx$1 :
	$$(MKDIR)

testbuilds/crx$1/script.js : $$(call pieces,crx) | testbuilds/crx$1 .events/compile
	@echo Concatenating: $$@
	@$$(call CAT,$$(call QUOTE,$$(call pieces,crx)),$$@)

testbuilds/crx$1/eventPage.js : tmp/eventPage.js | testbuilds/crx$1
	$$(CP)

testbuilds/crx$1/icon%.png : src/meta/icon%.png | testbuilds/crx$1
	$$(CP)

testbuilds/crx$1/manifest.json : src/meta/manifest.json version.json $(template_deps) | testbuilds/crx$1
	$(template) $$< $$@ type=crx channel=$1

testbuilds/updates$1.xml : src/meta/updates.xml version.json $(template_deps) | testbuilds/crx$1
	$(template) $$< $$@ type=crx channel=$1

testbuilds/updates$1.json : src/meta/updates.json version.json $(template_deps) | testbuilds/crx$1
	$(template) $$< $$@ type=crx channel=$1

testbuilds/$(name)$1.crx.zip : \
 $(foreach f,$(crx_contents),testbuilds/crx$1/$(f)) \
 package.json version.json tools/zip-crx.js
	node tools/zip-crx.js $1

testbuilds/$(name)$1.crx : $(foreach f,$(crx_contents),testbuilds/crx$1/$(f)) version.json tools/sign.sh | tmp
	tools/sign.sh $1

testbuilds/$(name)$1.meta.js : src/meta/metadata.js src/meta/icon48.png version.json src/Archive/archives.json $(template_deps) | testbuilds
	$(template) $$< $$@ type=userscript channel=$1

testbuilds/$(name)$1.user.js : testbuilds/$(name)$1.meta.js tmp/meta-newline.js $$(call pieces,userscript) | .events/compile
	@echo Concatenating: $$@
	@$$(call CAT,testbuilds/$(name)$1.meta.js tmp/meta-newline.js $$(call QUOTE,$$(call pieces,userscript)),$$@)

endef

$(eval $(call rules_channel,))
$(eval $(call rules_channel,-beta))
$(eval $(call rules_channel,-noupdate))

testbuilds/$(name).zip : testbuilds/$(name)-noupdate.crx.zip
	$(CP)

builds/% : testbuilds/% | builds
	$(CP)

test.html : README.md template.jst tools/markdown.js
	node tools/markdown.js

index.html : test.html
	$(CP)

tmp/.jshintrc : src/meta/jshint.json tmp/declaration.js src/globals/globals.js $(template_deps) | tmp
	$(template) $< $@

.events/jshint : $(dests) tmp/.jshintrc
	$(BIN)jshint $(call QUOTE, \
	 $(if $(filter-out $(dests),$?), \
	  $(dests), \
	  $(filter $(dests),$?) \
	 ) \
	)
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
	git worktree add $@ $(meta_distBranch)

$(wildcard dist/* dist/*/*) : dist
	@

distready : dist $(wildcard dist/* dist/*/*)
	cd dist && git checkout $(meta_distBranch)
	cd dist && git pull

.events2/push-git : .git/refs/heads .git/refs/tags $(wildcard .git/refs/heads/* .git/refs/tags/*) | .events2 distready
	git push origin --tags -f
	git push origin --all
	echo -> $@

.events2/push-web : .git/refs/heads/$(meta_distBranch) | .events2 distready
	git push web --tags -f
	git push web $(meta_distBranch)
	echo -> $@

.events2/push-store : .git/refs/tags/stable | .events2 distready
	node tools/webstore.js
	echo -> $@

.SECONDARY :

.PHONY: default all distready script crx release jshint install push $(npgoals)

script : $(script)

crx : $(crx)

release : $(release)

jshint : .events/jshint

install : .events/install

push : .events2/push-git .events2/push-web .events2/push-store

clean :
	$(RMDIR) tmp tmp-crx testbuilds .events
	$(RM) .tests_enabled

cleanrel : clean
	$(RMDIR) builds

cleanweb :
	$(RM) test.html

cleanfull : clean cleanweb
	$(RMDIR) .events2 dist node_modules
	git worktree prune

withtests :
	echo true> .tests_enabled
	-$(MAKE)
	echo false> .tests_enabled

archives :
	git fetch -n archives
	git merge --no-commit -s ours archives/gh-pages
	git show archives/gh-pages:archives.json > src/Archive/archives.json
	-git commit -am 'Update archive list.'

$(foreach i,1 2 3 4,bump$(i)) :
	$(MAKE) archives
	node tools/bump.js $(subst bump,,$@)
	$(MAKE) .events/CHANGELOG
	$(MAKE) all

tag :
	git add builds
	$(MAKE) cleanrel
	$(MAKE) all
	git diff --quiet -- builds
	$(MAKE) tagcommit

tagcommit :
	git commit -am "Release $(meta_name) v$(version)."
	git tag -a $(version) -m "$(meta_name) v$(version)."

beta : distready
	git tag -af beta -m "$(meta_name) v$(version)."
	cd dist && git merge --no-commit -s ours beta
	cd dist && git checkout beta "builds/*-beta.*" img .gitignore .gitattributes
	cd dist && git commit -am "Move $(meta_name) v$(version) to beta channel."

stable : distready
	git push . HEAD:bstable
	git tag -af stable -m "$(meta_name) v$(version)."
	cd dist && git merge --no-commit -s ours stable
	cd dist && git checkout stable "builds/$(name).*" builds/updates.xml builds/updates.json
	cd dist && git commit -am "Move $(meta_name) v$(version) to stable channel."

web : index.html distready
	-git commit -am "Build web page."
	cd dist && git merge --no-commit -s ours master
	cd dist && git checkout master README.md index.html web.css img .gitignore .gitattributes
	cd dist && git commit -am "Update web page."

update :
	$(RM) package-lock.json
	npm install --save-dev $(shell node tools/unpinned.js)
	npm install

updatehard :
	$(RM) package-lock.json
	npm install --save-dev $(shell node tools/unpinned.js latest)
	npm install
