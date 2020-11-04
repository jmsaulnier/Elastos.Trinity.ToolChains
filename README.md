# Elastos.Trinity.ToolChains

## Content

| Folder | Content |
| ---- | ---- |
| /native | Various scripts to convert a trinity app to a native app |
| /bin | Various scripts to build trinity, sign and verify DApps |
| /cli | The Trinity command line tool to create new DApps, run and debug them, create a developer DID, publish DApps  |
| /doc | Tools to generate Trinity documentation (plugins API reference mostly) |
| /typings | Tools to generate Typescript types for Trinity plugins, and serve them to developers as a NPM module |


## Build docker image
If you're a developer and want to build your own toolchain docker image that will be used to convert an elastOS capsule to a standalone native app, you need to first build the image 
```
docker build --build-arg "CACHE_BUST=$(date +%s)" -f native/tools/Dockerfile -t elastos/toolchain native/tools/;
docker push elastos/toolchain:latest
```