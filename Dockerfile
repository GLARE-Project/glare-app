ARG REPOSITORY_URL
ARG BRANCH_NAME
ARG EXPOSED_PORT
ARG BASE_WORKDIR="/app"

FROM node:lts-alpine

# arguments used outside of a build stage
ARG REPOSITORY_URL
ARG BRANCH_NAME
ARG EXPOSED_PORT
ARG BASE_WORKDIR

ENV EXPOSED_PORT ${EXPOSED_PORT}

RUN apk add --no-cache git bash
RUN apk add --no-cache python3 py3-pip build-base make
RUN mkdir -p $BASE_WORKDIR
WORKDIR "${BASE_WORKDIR}"

RUN git clone $REPOSITORY_URL . &> /dev/null
RUN git checkout $BRANCH_NAME
RUN printf 'REACT_APP_ENDPOINT=https://glare.cs.kent.edu/v1 \n\
REACT_APP_PROJECT=628ef3fa0f05ab4b00e5 \n\
REACT_APP_DATABASE_ID=64869d98deec0f4a7577 \n\
REACT_APP_COLLECTION_ID=628ef4a99bd8906b3c9b \n\
REACT_APP_IMAGE_ID=628ef5485c47b64623e3 \n\
REACT_APP_AUDIO_ID=628ef56e87fbbd0903a0' >> .env
RUN npm install --legacy-peer-deps --quiet
RUN npm run build
EXPOSE ${EXPOSED_PORT}
RUN npm install serve -g
# usings sh -c to pass environment variable context
CMD ["sh", "-c", "serve -s build -p tcp://0.0.0.0:$EXPOSED_PORT"]
