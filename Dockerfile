FROM public.ecr.aws/lambda/nodejs:14
COPY dist/index.js ${LAMBDA_TASK_ROOT}
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci --production-only
CMD [ "index.handler" ]
