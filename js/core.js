Array.prototype.getVal = function (x, y) {
    if (y !== undefined) return this[x][y];
    return this[x];
};
Array.prototype.setVal = function (val, x, y) {
    if (y !== undefined) {
        this[x][y] = val;
    } else {
        this[x] = val;
    }
};

var Helpers = (function (undefined) {
    
    function isAr(val) {
        return val instanceof Array;
    };
    
    function validIndex(arr, x, y) {
        if (y !== undefined) {
            return x > -1 && y > -1 && x < arr.length && y < arr[x].length;
        } 
        return x > -1 && arr.length > x;
    };
    
    function tryAdd(arr, val, x, y) {
        if (validIndex(arr, x, y)) {
            arr.setVal(arr.getVal(x, y) + val, x, y);
        }
    };
    
    function addNeighbor(arr, x, y) {
        tryAdd(arr, 1, x + 1, y);
        tryAdd(arr, 1, x - 1, y);
        tryAdd(arr, 1, x + 1, y + 1);
        tryAdd(arr, 1, x - 1, y + 1);
        tryAdd(arr, 1, x + 1, y - 1);
        tryAdd(arr, 1, x - 1, y - 1);
        tryAdd(arr, 1, x, y + 1);
        tryAdd(arr, 1, x, y - 1);
    };
    
    function forEach(arr, action) {
        for (var x = 0; x < arr.length; x++) {
            if (isAr(arr[x])) {
                for (var y = 0; y < arr[x].length; y++) {
                    action(arr, x, y);
                }
            } else {
                action(arr, x);
            }
        }
    };

    function copy(arr) {
        var newArray = arr.slice(0);
        for (var x = 0; x < newArray.length; x++) {
            if (isAr(newArray[x])) {
                newArray[x] = copy(newArray[x]);
            }
        }
        return newArray;
    };

    return {
        isArray: isAr,
        deepCopy: copy,
        addToNeighborCells: addNeighbor,
        deepForEach: forEach
    };
}());

var Game = function(startingPopulation) {
    this.current = Helpers.deepCopy(startingPopulation);
    this.updateProximityMap();
    this.canEvolve = true;
};

Game.prototype.updateProximityMap = function() {
    var heatMap = Helpers.deepCopy(this.current);
    
    Helpers.deepForEach(heatMap, function (arr, x, y) {
        arr.setVal(0, x, y);
    });

    Helpers.deepForEach(this.current, function (arr, x, y) {
        if (arr.getVal(x, y) === 1) Helpers.addToNeighborCells(heatMap, x, y);
    });
    
    this.proximityMap = heatMap;
};

Game.prototype.evolve = function () {
    var that = this;
    var evolved = false;
    Helpers.deepForEach(this.current, function (arr, x, y) {
        if (that.cellShouldDie(x, y)) {
            arr.setVal(0, x, y);
            evolved = true;
        }
        if (that.cellShouldComeAlive(x, y)) {
            arr.setVal(1, x, y);
            evolved = true;
        }
    });
    this.canEvolve = evolved;
    this.updateProximityMap();
};

Game.prototype.cellShouldDie = function(x, y) {
    return this.current.getVal(x, y) === 1 && (this.proximityMap.getVal(x, y) < 2 || this.proximityMap.getVal(x, y) > 3);
};

Game.prototype.cellShouldComeAlive = function (x, y) {
    return this.current.getVal(x, y) === 0 && this.proximityMap.getVal(x, y) === 3;
};
