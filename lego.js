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
    var copyCollection = [];
    collection.forEach(function (person) {
        copyCollection.push(Object.assign({}, person));
    });

    if (arguments.length === 1) {
        return copyCollection;
    }
    var commands = [].slice.call(arguments, 1);
    commands = commands.sort(sortCommands);

    commands.forEach(function (command) {
        copyCollection = command(copyCollection);
    });

    return copyCollection;
};

exports.select = function () {
    var fields = [].slice.call(arguments, 0);

    return function select(collection) {
        return collection.map(function (person) {
            for (var key in person) {
                if (fields.indexOf(key) === -1) {
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
            var ruleAsc = personA[property] > personB[property];
            var ruleDesc = personB[property] > personA[property];

            return order === 'asc' ? ruleAsc : ruleDesc;
        });

    };
};


exports.format = function (property, formatter) {

    return function format(collection) {
        return collection.map(function (person) {
            if (Object.keys(person).indexOf(property) !== -1) {
                var value = person[property];
                person[property] = formatter(value);
            }

            return person;
        });

    };
};

exports.limit = function (count) {
    return function limit(collection) {
        var limitCollection = collection.slice(0, count);

        return limitCollection;

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
