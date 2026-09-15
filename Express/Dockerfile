# Basic image for the backend — node:22-alpine keeps it small.
FROM node:22-alpine

# Everything lives here inside the container.
WORKDIR /app

# Copy just the package files first so `npm install` gets cached
# and only re-runs when dependencies actually change.
COPY package*.json ./
RUN npm install

# Now copy the rest of the source code.
COPY . .

# The app listens on this port (see PORT in src/server.ts).
EXPOSE 3000

# Runs the server with tsx, same as `npm run devrun` but without
# watch mode (we don't need file-watching inside a container).
CMD ["npm", "start"]
