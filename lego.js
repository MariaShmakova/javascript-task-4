'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

var ORDER_COMMANDS = ['filterIn', 'or', 'and', 'sortBy', 'select', 'limit', 'format'];

function sortCommands(commandA, commandB) {
    return ORDER_COMMANDS.indexOf(commandA.name) - ORDER_COMMANDS.indexOf(commandB.name);
}

exports.query = function (collection) {
    collection = collection.map(function (person) {
        return Object.assign({}, person);
    });
    var commands = [].slice.call(arguments, 1);
    commands.sort(sortCommands);

    return commands.reduce(function (currentCollection, command) {
        return command(currentCollection);
    }, collection);
};

exports.select = function () {
    var fields = [].slice.call(arguments, 0);

    return function select(collection) {
        return collection.map(function (person) {
            for (var key in person) {
                if (person.hasOwnProperty(key) && fields.indexOf(key) === -1) {
                    delete person[key];
                }
            }

            return person;
        });
    };
};

exports.filterIn = function (property, values) {
    return function filterIn(collection) {
        return collection.filter(function (person) {
            return values.indexOf(person[property]) !== -1;
        });
    };
};

exports.sortBy = function (property, order) {
    return function sortBy(collection) {
        return collection.sort(function (personA, personB) {
            if (personA[property] > personB[property]) {
                return order === 'asc' ? 1 : -1;
            }
            if (personA[property] < personB[property]) {
                return order === 'asc' ? -1 : 1;
            }

            return 0;
        });
    };
};

exports.format = function (property, formatter) {
    return function format(collection) {
        return collection.map(function (person) {
            if (person.hasOwnProperty(property)) {
                person[property] = formatter(person[property]);
            }

            return person;
        });
    };
};

exports.limit = function (count) {
    return function limit(collection) {
        return collection.slice(0, count);
    };
};

if (exports.isStar) {

    exports.or = function () {
        var filters = [].slice.call(arguments, 0);

        return function or(collection) {
            return collection.filter(function (person) {
                return filters.some(function (currentFilter) {
                    return currentFilter(collection).indexOf(person) !== -1;
                });
            });
        };
    };

    exports.and = function () {
        var filters = [].slice.call(arguments, 0);

        return function and(collection) {
            return collection.filter(function (person) {
                return filters.every(function (currentFilter) {
                    return currentFilter(collection).indexOf(person) !== -1;
                });
            });
        };
    };
}
