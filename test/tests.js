// Tests. Mocha/assert style. See
// http://visionmedia.github.com/mocha/
// http://nodejs.org/docs/latest/api/assert.html

/*jshint multistr:true */
/*jshint -W010 */
/*jshint -W053 */
/*jshint -W054 */
// 10 allows us to test Object
// 53 allows us to test Number, String etc constructors.
// 54 allows us to test Function constructors.

const assert = require('assert'),
	agave = require('../index.js');

var mockObject = {
	foo: 'bar',
	baz: {
		bam:'boo',
		zar:{
			zog:'victory'
		}
	},
	null:{
		'yarr':{
			'parrot':'ahoy'
		}
	}
};

agave('av');

suite('Array.extend', function(){
	test('extends the array accurately', function(){
		assert.deepEqual([1,2,3].avextend([4,5]), [1,2,3,4,5] );
	});
});

suite('String.reverse', function(){
	test('reverses strings accurately', function(){
		assert.equal('Hello world'.avreverse(), 'dlrow olleH');
	});
});

suite('String.leftStrip', function(){
	test('strips from the left accurately', function(){
		assert.equal('Hello world'.avleftStrip('Hle'), 'o world');
	});
});

suite('String.rightStrip', function(){
	test('strips from the right accurately', function(){
		assert.equal('Hello world'.avrightStrip('ldr'), 'Hello wo');
	});
});

suite('String.rightStrip', function(){
	test('strips from the left accurately with a single character', function(){
		assert.equal('a'.avleftStrip('a'), '');
	});
});

suite('String.strip', function(){
	test('strips from the both sides accurately', function(){
		assert.equal('Hello world'.avstrip('Hld'), 'ello wor');
	});
});

suite('Object.getKeys', function(){
	test('fetches keys accurately', function(){
		assert.deepEqual(mockObject.avgetKeys(), ["foo","baz","null"] );
	});
});

suite('Object.getSize', function(){
	test('counts keys accurately', function(){
		assert.equal(mockObject.avgetSize(), 3);
	});
});

suite('Array.remove', function () {
	test('correctly removes the given member', function (){
		var arr = [1,2,3,4,5];
		arr.avremove(3);
		assert.deepEqual(arr, [1,2,4,5]);
	});
	if('returns true if the given member was in the array', function () {
		assert.equal([1,2,3,4,5].remove(3), true);
	});
	if('returns false if the given member was not in the array', function () {
		assert.equal([1,2,3,4,5].remove(6), false);
	});
});

suite('Object.getPath', function(){
	test('returns undefined when a value is missing', function(){
		assert.equal(mockObject.avgetPath(['foo','pineapple']), undefined);
	});
	test('returns the value when the provided keys exist', function(){
		assert.equal(mockObject.avgetPath(['baz','zar','zog']), 'victory');
	});
	test('returns the value when the provided keys exist, even if null is on the path', function(){
		assert.equal(mockObject.avgetPath([null,'yarr','parrot']), 'ahoy');
	});
	test('works using Unix-style paths', function(){
		assert.equal(mockObject.avgetPath('/baz/zar/zog'), 'victory');
	});
});

suite('Object.clone', function(){
	var copyObject = mockObject.avclone();
	test('clones objects so that modification to the new object will not affect the original', function(){
		copyObject.baz.bam = 'newvalue';
		assert.equal(copyObject.avgetPath(['baz','bam']), 'newvalue');
		assert.equal(mockObject.avgetPath(['baz','bam']), 'boo');
	});
});

suite('Object.forEach', function(){
	var keyResults = [];
	var valueResults = [];
	mockObject.avforEach(function(key, value){
		keyResults.push(key);
		valueResults.push(value);
	});
	test('iterates over keys properly', function(){
		assert.deepEqual(keyResults, ["foo","baz","null"]);
	});
	test('iterates over values properly', function(){
		assert.deepEqual(valueResults, [
			"bar",
			{"bam":"boo",
				"zar":{
					"zog":"victory"
				}
			},
			{"yarr":
				{"parrot":"ahoy"}
			}
		]);
	});
});

suite('Object.extend', function(){
	var results = mockObject.avclone().avextend({
		'gnar':{
			shub:'zoo'
		},
		'gert':{
			yaz:'frub'
		}
	});

	test('creates extends the object with the new properties', function(){
		assert.deepEqual(results, {
			"foo":"bar",
			"baz":{
				"bam":"boo",
				"zar":{
					"zog":"victory"}
				},
				"null":{
					"yarr":{
						"parrot":"ahoy"
					}
				},
			"gnar":{
				"shub":"zoo"
			},
			"gert":{
				"yaz":"frub"
			}
		});
	});
});

suite('Object.compare', function(){
	test('accurately identifies similar objects', function(){
		var identicalObject = {
			foo: 'bar',
			baz: {
				bam:'boo',
				zar:{
					zog:'victory'
				}
			},
			null:{
				'yarr':{
					'parrot':'ahoy'
				}
			}
		};
		assert(mockObject.avcompare(identicalObject));
	});
	test('accurately identifies different objects', function(){
		var differentObject = {
			foo: 'bar',
			baz: {
				bam:'boo',
				zar:{
					zog:'victory'
				}
			}
		};
		assert.equal(mockObject.avcompare(differentObject), false);
	});
});

suite('Function.throttle', function(){
	var valueShouldOnlyBeOne = 0; // Since the function should only run once
	var timesFunctionHasRan = 0;
	var maxTimesToRun = 3;
	test('stops function calls overlapping', function(done){
		var intervalID = setInterval(function(){
			// thottledFunction would normally run three times in this loop, 50ms apart, but .avthrottle() means it
			// will only be run once after 70ms of inactivity
			var thottledFunction = function(){
				valueShouldOnlyBeOne++;
			}.avthrottle(70);
			thottledFunction();
			timesFunctionHasRan++;
			if ( timesFunctionHasRan === maxTimesToRun ) {
				clearInterval(intervalID);
				assert.equal(valueShouldOnlyBeOne, 1);
				done();
			}
		}, 50);
	});
});

suite('Function.repeat', function(){

	test('repeats', function(done){
		var count = 0
		var increment = function(){
			count += 1
			if ( count === 3 ) {
				done();
			}
		}
		increment.repeat([], 50, true)
	});
	test('repeats with arguments omitted', function(done){
		var count = 0
		this.timeout(11 * 1000);
		var increment = function(){
			count += 1
			if ( count === 3 ) {
				done();
			}
		}
		increment.repeat(50, true)
	});
});



suite('Number.days', function(){
	test('correctly converts a number to days in seconds', function(){
		assert.equal((5).avdays, 432000000);
	});
});

suite('Number.weeks.before and .after', function(){
	test('correctly converts a number to a period in weeks before a set date', function(){
		var someDate = new Date('Thu Jun 06 2013 22:44:05 GMT+0100 (UTC)');
		var timezoneOffset = someDate.getTimezoneOffset();
		var targetDate = new Date('Thu May 16 2013 22:44:05 GMT+0100 (UTC)')
		assert.equal((3).avweeks.avbefore(someDate).getDate(), targetDate.getDate());
	});
	test('correctly converts a number to a period in weeks after a set date', function(){
		var someDate = new Date('Thu Jun 27 2013 22:44:05 GMT+0100 (UTC)');
		var timezoneOffset = someDate.getTimezoneOffset();
		var targetDate = new Date('Thu Jun 06 2013 22:44:05 GMT+0100 (UTC)');
		assert.equal((3).avweeks.avbefore(someDate).getDate(), targetDate.getDate());
	});
});

suite('Date functions', function(){
	test('isOnWeekend works', function(){
		var dayOnWeekend = new Date('Sun Jul 31 2016 18:55:19 GMT+0100 (BST)');
		assert(dayOnWeekend.isOnWeekend())
	});

	test('isOnWeekend does not give false positives', function(){
		var dayOnWeek = new Date('Wed Aug 03 2016 18:55:19 GMT+0100 (BST)')
		assert.equal(dayOnWeek.isOnWeekend(), false)
	});

	test('withoutTime returns a time at midnight (skip on Travis due to Travis odd timezone handling)', function(){
		var someDay = new Date('Sun Jul 31 2016 18:55:19 GMT+0100 (BST)')
		assert.deepEqual(someDay.withoutTime(), new Date('Sun Jul 31 2016 00:00:00 GMT+0100 (BST)'))
	});

	test('date clone makes new dates which are not affected by changes in original', function(){
		var someDay = new Date('Sun Jul 31 2016 18:55:19 GMT+0100 (BST)')
		var someDayCopy = someDay.clone();
		someDay.setFullYear(2006)
		assert.deepEqual(someDayCopy, new Date('Sun Jul 31 2016 18:55:19 GMT+0100 (BST)'))
	});

	test(`date daysAgo() works`, function(){
		var someDay = new Date('Sun Jul 31 2016 18:55:19 GMT+0100 (BST)')
		var fakeNowDate = new Date('2018-04-16')
		assert.deepEqual(someDay.daysAgo(), 624)
	});
});

suite(`Agave doesn't affect for loops`, function(){
	it (`doesn't. really`, function(){
		for ( var key in mockObject ) {
			assert( ! ['avgetKeys','avgetSize','avgetPath'].includes(key) );
		}
	});
});

suite('kind', function(){
	test('shows number-like things as numbers', function(){
		assert(avkind(37) === 'Number');
		assert(avkind(3.14) === 'Number');
		assert(avkind(Math.LN2) === 'Number');
		assert(avkind(Infinity) === 'Number');
		assert(avkind(Number(1)) === 'Number');
		assert(avkind(new Number(1)) === 'Number');
	});
	test('shows NaN as NaN', function(){
		assert(avkind(NaN) === 'NaN');
	});
	test('Shows strings as strings', function(){
		assert(avkind('') === 'String');
		assert(avkind('bla') === 'String');
		assert(avkind(String("abc")) === 'String');
		assert(avkind(new String("abc")) === 'String');
	});
	test('shows strings accurately', function(){
		assert(avkind(true) === 'Boolean');
		assert(avkind(false) === 'Boolean');
		assert(avkind(new Boolean(true)) === 'Boolean');
	});
	test('shows arrays accurately', function(){
		assert(avkind([1, 2, 4]) === 'Array');
		assert(avkind(new Array(1, 2, 3)) === 'Array');
	});
	test('shows objects accurately', function(){
		assert(avkind({a:1}) === 'Object');
		assert(avkind(new Object()) === 'Object');
	});
	test('shows dates accurately', function(){
		assert(avkind(new Date()) === 'Date');
	});
	test('loves Functions too', function(){
		assert(avkind(function(){}) === 'Function');
		assert(avkind(new Function("console.log(arguments)")) === 'Function');
		assert(avkind(Math.sin) === 'Function');
	});
	test('shows undefined accurately', function(){
		assert(avkind(undefined) === 'undefined');
	});
	test('shows null accurately', function(){
		assert(avkind(null) === 'null');
	});
});

suite('Functions work with no prefix at all', function(){
	agave();
	test('strips from the right accurately', function(){
		assert.equal('Hello world'.rightStrip('ldr'), 'Hello wo');
	});
});



