FROM ubuntu:20.04

# Setup
RUN apt-get update -y &&                                \
    apt-get install software-properties-common -y &&    \
    add-apt-repository ppa:openjdk-r/ppa &&             \
    add-apt-repository ppa:deadsnakes/ppa

# Install the prerequisities
RUN apt-get update -y &&                        \
    apt-get install --no-install-recommends -y  \
        build-essential curl wget git unzip vim \
        openjdk-8-jdk                           \
        python3.8 python3-pip                   \
        nodejs npm

# Update pip and install node and npm related packages
RUN python3 -m pip install --upgrade pip &&                 \
    curl https://deb.nodesource.com/setup_12.x | bash &&    \
    npm install -g --unsafe-perm                            \
        cordova@10.0.0                                      \
        cordova-res@0.15.1                                  \
        @ionic/cli@6.12.1                                   \
        typescript@4.0.5                                    \
        @elastosfoundation/trinity-cli@1.1.34

# Setup a new user
RUN groupadd --gid 1000 elauser &&                                          \
    useradd --home-dir /home/elauser --create-home                          \
        --uid 1000 --gid 1000 --shell /bin/sh --skel /dev/null elauser

# Run everything from here on out with the newly created user
USER elauser

# Install android tools
RUN mkdir -p ${HOME}/android/android-sdk/cmdline-tools &&                                               \
    wget https://dl.google.com/android/repository/commandlinetools-linux-6609375_latest.zip -P /tmp &&  \
    unzip -d ${HOME}/android/android-sdk/cmdline-tools /tmp/commandlinetools-linux-*.zip &&             \
    chmod 775 ${HOME}/android/android-sdk/ -R &&                                                        \
    yes | ${HOME}/android/android-sdk/cmdline-tools/tools/bin/sdkmanager                                \
            "build-tools;28.0.3" "platform-tools" "platforms;android-28" "ndk;21.3.6528147" &&          \
    yes | ${HOME}/android/android-sdk/cmdline-tools/tools/bin/sdkmanager --licenses &&                  \
    wget https://services.gradle.org/distributions/gradle-5.4.1-bin.zip -P /tmp &&                      \
    unzip -d ${HOME}/android /tmp/gradle-*.zip &&                                                       \        
    mv ${HOME}/android/gradle-5.4.1 ${HOME}/android/gradle                

# Setup npm path and gradle properties
RUN mkdir ~/.npm-global ~/.gradle &&            \
    npm config set prefix '~/.npm-global' &&    \
    echo "org.gradle.jvmargs=-Xmx4096m -XX:MaxHeapSize=4096m -XX:MaxPermSize=4096m -XX:+HeapDumpOnOutOfMemoryError" >> ~/.gradle/gradle.properties && \
    echo "org.gradle.daemon=true\norg.gradle.parallel=true\norg.gradle.configureondemand=true" >> ~/.gradle/gradle.properties

# Setup environment variables
ENV SRC_DIR=/home/elauser/Elastos.Trinity
ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
ENV GRADLE_HOME=/home/elauser/android/gradle
ENV ANDROID_SDK_ROOT=/home/elauser/android/android-sdk/
ENV PATH="${PATH}:${GRADLE_HOME}/bin:${ANDROID_SDK_ROOT}/cmdline-tools/tools/bin:${ANDROID_SDK_ROOT}/tools:${ANDROID_SDK_ROOT}/platform-tools:/home/elauser/.local/bin:/home/elauser/.npm-global/bin"

ARG REPO_URL=https://github.com/elastos/Elastos.Trinity.git

# Clone repo
RUN git clone --recurse-submodules -j8 ${REPO_URL} ${SRC_DIR}

WORKDIR ${SRC_DIR}

ARG CACHE_BUST

RUN git pull --recurse-submodules

RUN cd ${SRC_DIR}/Dapps && git checkout master && git pull &&       \
    cd ${SRC_DIR}/Launcher && git checkout master && git pull &&    \
    cd ${SRC_DIR}/Plugins && git checkout master && git pull &&     \
    cd ${SRC_DIR}/Runtime && git checkout master && git pull &&     \
    cd ${SRC_DIR}/ToolChains && git checkout master && git pull

RUN pip install -r ${SRC_DIR}/ToolChains/native/tools/requirements.txt

# TODO: Need to find a good solution for this rather than just hard-coding the removal of the lines
RUN sed -i '/The app manifest must contain the application DID string to be able to secure intents/,+4 d' ${SRC_DIR}/ToolChains/native/bin/build_from_source