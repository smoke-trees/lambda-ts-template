FROM public.ecr.aws/lambda/nodejs:14
SHELL [ "/bin/bash", "-c" ]
RUN npm i -g nodemon 
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci --only=production
COPY dist/index.js ${LAMBDA_TASK_ROOT}
COPY dist/ /var/task/
ENTRYPOINT []
CMD [ "nodemon","--watch", "/var/task/*", "--exec", "/lambda-entrypoint.sh index.handler", "--signal","SIGTERM" ]
