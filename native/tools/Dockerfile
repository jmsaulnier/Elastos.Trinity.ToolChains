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

# Install android tools
RUN mkdir -p /usr/lib/android-sdk/cmdline-tools &&                                              \
    wget https://dl.google.com/android/repository/commandlinetools-linux-6609375_latest.zip &&  \
    unzip commandlinetools-linux-6609375_latest.zip -d /usr/lib/android-sdk/cmdline-tools &&    \ 
    chmod 775 /usr/lib/android-sdk/ -R &&                                                       \
    yes | /usr/lib/android-sdk/cmdline-tools/tools/bin/sdkmanager                               \
            "build-tools;29.0.3" "platform-tools" "platforms;android-29" "ndk;21.3.6528147" &&  \
    yes | /usr/lib/android-sdk/cmdline-tools/tools/bin/sdkmanager --licenses &&                 \
    wget https://services.gradle.org/distributions/gradle-5.4.1-bin.zip -P /tmp &&              \
    unzip -d /opt/gradle /tmp/gradle-*.zip

# Setup a new user
RUN groupadd --gid 1000 elauser &&                                          \
    useradd --home-dir /home/elauser --create-home                          \
        --uid 1000 --gid 1000 --shell /bin/sh --skel /dev/null elauser &&   \
    chown -R elauser:elauser /usr/lib/android-sdk

# Run everything from here on out with the newly created user
USER elauser

# Setup npm path and setup virtual environment
RUN mkdir ~/.npm-global &&                  \
    npm config set prefix '~/.npm-global'

# Setup environment variables
ENV SRC_DIR="/home/elauser/Elastos.Trinity"
ENV JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"
ENV GRADLE_HOME="/opt/gradle/gradle-5.4.1"
ENV ANDROID_SDK_ROOT="/usr/lib/android-sdk/"
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
RUN sed -i '/The app manifest must contain the application DID string to be able to secure intents/,+4 d' ${SRC_DIR}/ToolChains/bin/native/build 