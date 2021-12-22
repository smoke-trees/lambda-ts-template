FROM public.ecr.aws/lambda/nodejs:14
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci --only=production
COPY dist/index.js ${LAMBDA_TASK_ROOT}
COPY dist/ /var/task/
CMD [ "index.handler" ]
