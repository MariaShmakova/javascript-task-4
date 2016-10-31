'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

var ORDER_COMMANDS = ['filterIn', 'sortBy', 'select', 'limit', 'format'];

function sortCommands(commandA, commandB) {
    return ORDER_COMMANDS.indexOf(commandA.name) - ORDER_COMMANDS.indexOf(commandB.name);
}

function emptyCollection(collection) {
    var arrCheckEmpty = collection.map(function (person) {
        if (Object.keys(person).length !== 0) {
            return false;
        }

        return true;
    });
    if (arrCheckEmpty.indexOf(true) !== -1) {
        return true;
    }

    return false;
}
exports.query = function (collection) {
    var copyCollection = [];
    collection.forEach(function (person) {
        copyCollection.push(Object.assign({}, person));
    });

    if (arguments.length === 1) {
        return copyCollection;
    }
    var commands = Array.prototype.slice.call(arguments, 1);
    commands = commands.sort(sortCommands);
    for (var i = 0; i < commands.length; i++) {
        copyCollection = commands[i](copyCollection);
    }
    if (emptyCollection(copyCollection)) {
        return [];
    }

    return copyCollection;
};

exports.select = function () {
    var fields = [];
    for (var i = 0; i < arguments.length; i++) {
        fields.push(arguments[i]);
    }

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
            return (values.indexOf(person[property]) !== -1);
        });

    };

};

exports.sortBy = function (property, order) {

    return function sortBy(collection) {
        switch (order) {
            case 'asc':
                collection = collection.sort(function (personA, personB) {
                    return personA[property] - personB[property];
                });
                break;

            case 'desc':
                collection = collection.sort(function (personA, personB) {
                    return personB[property] - personA[property];
                });
                break;

            default:
                break;
        }

        return collection;

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

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.or = function () {
        return;
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.and = function () {
        return;
    };
}
