const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull} = graphql;

const {directorModel, movieModel} = require('../models/')


// const movies = [
//     {id:'1', name: 'Sun of city', genre: 'drama', directorID: '1'},
//     {id:'2', name: 'War', genre: 'history', directorID: '2'},
//     {id:'3', name: 'Big city', genre: 'detective', directorID: '3'},
//     {id:'4', name: 'Small city', genre: 'detective', directorID: '4'},
//     {id:'5', name: 'Dracula', genre: 'horror', directorID: '5'},
//     {id:'6', name: 'Part1', genre: 'drama', directorID: '6'},
//     {id:'7', name: 'Part2', genre: 'drama', directorID: '6'},
//     {id:'8', name: 'MadMax', genre: 'drama', directorID: '7'},
//     {id:'9', name: '1874', genre: 'history', directorID: '7'}
// ]
//
// const directors = [
//     {id:'1', name: 'Filip', age: '55'},
//     {id:'2', name: 'Alex', age: '62'},
//     {id:'3', name: 'Martin', age: '28'},
//     {id:'4', name: 'Robert', age: '32'},
//     {id:'5', name: 'Bob', age: '44'},
//     {id:'6', name: 'Quentin', age: '50'},
//     {id:'7', name: 'Max', age: '45'}
// ]

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        genre: {
            type: new GraphQLNonNull(GraphQLString)
        },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                // return directors.find(director => director.id === parent.id )
                return directorModel.findById(parent.directorID)
            }
        }
    })
})

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        age: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies.filter(movie => movie.directorID === parent.id)
                return movieModel.find({directorID: parent.id})
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: {type: new GraphQLNonNull( GraphQLString)},
                age: {type: new GraphQLNonNull( GraphQLInt)}
            },
            resolve(parent, args) {
                const director = new directorModel({
                    name: args.name,
                    age: args.age
                });
                return director.save()
            }
        },
        addMovie: {
            type: MovieType,
            args: {
                name: {type: new GraphQLNonNull( GraphQLString)},
                genre: {type: new GraphQLNonNull( GraphQLString)},
                directorID: {type: GraphQLID},
            },
            resolve(parent, args) {
                const movie = new movieModel({
                    name: args.name,
                    genre: args.genre,
                    directorID: args.directorID,
                });
                return movie.save()
            }
        },
        removeDirector: {
            type: DirectorType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args) {
                return directorModel.findByIdAndRemove(args.id);
            }
        },
        removeMovie: {
            type: MovieType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args) {
                return movieModel.findByIdAndRemove(args.id);
            }
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: {type: GraphQLID},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args) {
                return directorModel.findByIdAndUpdate(args.id, {
                    $set:
                        {
                            name: args.name,
                            age: args.age
                        }
                }, {new: true})
            }
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: {type: GraphQLID},
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                directorID: {type: GraphQLID}
            },
            resolve(parent, args) {
                return movieModel.findByIdAndUpdate(args.id, {
                    $set:
                        {
                            name: args.name,
                            genre: args.genre,
                            directorID: args.directorID
                        }
                }, {new: true})
            }
        }
    }
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                // return movies.find(movie => movie.id === args.id);
                return movieModel.findById(args.id)
            }
        },
        director: {
            type: DirectorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                // return directors.find(director => director.id === args.id);
                return directorModel.findById(args.id)
            }
        },
        movies: {
            type: GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies
                return movieModel.find({})
            }
        },
        directors: {
            type: GraphQLList(DirectorType),
            resolve(parent, args) {
                // return directors
                return directorModel.find({})
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});
