describe('the purpose of the array prototype method getVal', function () {
    it('gets the value from the cell of a one dimensional array when y is undefined', function () {
        expect([2, 3].getVal(0)).toBe(2);
    });

    it('gets the value from the cell of a two dimensional array when y is defined', function () {
        expect([[1, 0], [2, 3]].getVal(0, 1)).toBe(0);
    });
});

describe('the purpose of the array prototype method setVal', function () {
    it('sets the value of a cell in a one dimensional arrays when y is undefined', function () {
        var oneDimArray = [0, 1, 2, 3];
        var output = [0, 1, -3, 3];
        oneDimArray.setVal(-3, 2);
        expect(oneDimArray).toEqual(output);
    });

    it('sets the value of a cell in a two dimensional arrays when y is defined', function () {
        var twoDimArray = [[0, 1, 2, 3], [0, 1, 2, 3]];
        var output = [[0, 1, 2, 3],[0, -3, 2, -2]];
        twoDimArray.setVal(-3, 1, 1);
        twoDimArray.setVal(-2, 1, 3);
        expect(twoDimArray).toEqual(output);
    });
});

describe('what this helper library can do', function () {
    it('can detect arrays', function () {
        expect(Helpers.isArray([])).toBe(true);
        expect(Helpers.isArray(new Array())).toBe(true);
    });

    it('can deep copy a two dimensional array', function () {
        var source = [
            [1, 2],
            [3, 4]
        ];
        var output = [
            [1, 2],
            [3, 4]
        ];
        expect(Helpers.deepCopy(source)).not.toBe(source);
        expect(Helpers.deepCopy(source)).toEqual(output);
    });

    it('can apply an action on each cell of a one-dimension array', function () {
        var source = [0, 1, 2, 3, 4];
        var output = [1, 2, 3, 4, 5];
        Helpers.deepForEach(source, function (arr, x) {
            arr[x] += 1;
        });
        expect(source).toEqual(output);
    });

    it('can apply an action on each cell of a two-dimension array', function () {
        var source = [[0, 1],[2, 3]];
        var output = [[1, 2], [3, 4]];
        
        Helpers.deepForEach(source, function (arr, x, y) {
            arr[x][y] += 1;
        });
        expect(source).toEqual(output);
    });
    
    it('can add one to neighboring cells of a one-dimension array', function () {
        var oneDimensional = [0, 0, 0, 0];
        var expected1 = [0, 1, 0, 1];
        Helpers.addToNeighborCells(oneDimensional, 2);
        expect(oneDimensional).toEqual(expected1);
    });
    
    it('can add one to neighboring cells of a two-dimension array', function () {
        var twoDimensional = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        var expected2 = [
            [1, 2, 0],
            [1, 2, 0],
            [1, 1, 0]
        ];
        Helpers.addToNeighborCells(twoDimensional, 0, 0);
        Helpers.addToNeighborCells(twoDimensional, 1, 0);

        expect(twoDimensional).toEqual(expected2);
    });
});

describe('a population proximity map', function () {
    it('is empty when there is only a single cell', function () {
        var game = new Game([1]);
        expect(game.proximityMap).toEqual([0]);
    });
    
    it('is empty when all cells are empty', function () {
        var empty = new Game([[0, 0], [0, 0]]);
        expect(empty.proximityMap).toEqual([[0, 0], [0, 0]]);
    });
    
    it('shows the neighbor counts of a one dimensional arrays', function () {
        var game = new Game([1, 0, 0, 1]);
        expect(game.proximityMap).toEqual( [0, 1, 1, 0]);
    });
    
    it('shows the neighbor counts of a two dimensional array', function () {
        var game = new Game([[1, 1], [1, 0]]);
        expect(game.proximityMap).toEqual([[2, 2], [2, 3]]);
    });
});

describe('what should happen to a cell when the generation evolves', function () {
    it('should die if it has fewer than two live neighbors', function() {
        var g = new Game([0, 0, 1, 1, 0]);
        expect(g.cellShouldDie(2)).toBe(true);
        expect(g.cellShouldDie(3)).toBe(true);
    });
    it('should stay alive if it has two or three live neighbors', function() {
        var g = new Game([0, 1, 1, 1, 0]);
        g.evolve();
        expect(g.current[2]).toEqual(1);
    });
    it('should die if it has more than three live neighbors', function() {
        var g = new Game([[0, 0, 1], [1, 1, 1], [0, 1, 0]]);
        expect(g.cellShouldDie(1, 1)).toBe(true);
    });
    it('should come to life if it has exactly three live neighbors', function() {
        var g = new Game([[0, 0, 1],
                        [1, 1, 1],
                        [0, 1, 0]]);
        expect(g.cellShouldComeLive(2, 2)).toBe(true);
    });
});

describe('what happens when a generation evolves', function () {
    it('stays the same when there is nothing to begin with', function () {
        var game = new Game([0]);
        game.evolve();
        expect(game.current).toEqual([0]);
    });
    
    it('doesn\'t last on its own', function () {
        var game = new Game([1]);
        game.evolve();
        expect(game.current).toEqual([0]);
    });
    
    it('survives with some neighbors', function () {
        var some = new Game([[1, 1], [1, 0]]);
        some.evolve();
        expect(some.current).toEqual([[1, 1], [1, 1]]);
    });
    
    it('dies out when it is overcrowded', function () {
        var crowd = new Game([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
        var afterOne = [[1, 0, 1], [0, 0, 0], [1, 0, 1]];
        crowd.evolve();
        expect(crowd.current).toEqual(afterOne);
        crowd.evolve();
        expect(crowd.current).toEqual([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
    });

    it('solves the example', function () {
        var example = [
            [0, 1, 0, 0, 0],
            [1, 0, 0, 1, 1],
            [1, 1, 0, 0, 1],
            [0, 1, 0, 0, 0],
            [1, 0, 0, 0, 1]
        ];
        
        var result = [
            [0, 0, 0, 0, 0],
            [1, 0, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ];
        
        var expGame = new Game(example);
        expGame.evolve();

        expect(expGame.current).toEqual(result);
    });
});