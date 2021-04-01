import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.js`);

const resolvers = mergeResolvers(loadedResolvers);
const typeDefs = mergeTypeDefs(loadedTypes);

export { resolvers, typeDefs };
