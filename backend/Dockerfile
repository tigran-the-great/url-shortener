FROM node:18

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy the full source (including tsconfig and src/)
COPY . .

# ✅ Compile TypeScript into dist/
RUN npm run build

EXPOSE 5001

# Run the compiled output
CMD ["npm", "start"]
