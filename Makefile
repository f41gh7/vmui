REPO=victoriametrics/ui

BUILDINFO_TAG ?= $(shell echo $$(git describe --long --all | tr '/' '-')$$( \
	      git diff-index --quiet HEAD -- || echo '-dirty-'$$(git diff-index -u HEAD | openssl sha1 | cut -c 10-17)))

PKG_TAG ?= $(shell git tag -l --points-at HEAD)
ifeq ($(PKG_TAG),)
PKG_TAG := $(BUILDINFO_TAG)
endif


package-via-docker:
	cd packages/victoria-metrics-ui &&\
	docker build -t ${REPO}:latest -f Dockerfile-web .

release-via-docker: package-via-docker
	echo ${PKG_TAG}
	docker tag ${REPO}:latest ${REPO}:${PKG_TAG}
	docker rm ui-build-${PKG_TAG} 2>> /dev/null || true
	docker create --name ui-build-${PKG_TAG} ${REPO}:${PKG_TAG}
	docker cp ui-build-${PKG_TAG}:/app/web $(shell pwd)/ui-web
	zip -r ui-web.zip ui-web
	docker rm  ui-build-${PKG_TAG}

latest-push: package-via-docker
	docker push ${REPO}

release-push: release-via-docker
	docker push ${REPO}:${PKG_TAG}