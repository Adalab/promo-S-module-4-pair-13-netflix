FROM node:16

# Create and define app directory
WORKDIR /home/node/app

# Install nodemon (for development purpouses...)
RUN npm install -g nodemon

# Copy files from host
COPY . .

# Install the node/js dependencies
RUN npm install

# Run the project
CMD npm run dev