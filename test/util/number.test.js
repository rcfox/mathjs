// test number utils
var assert = require('assert'),
    approx = require('../../tools/approx'),
    BigNumber = require('bignumber.js'),
    number = require('../../lib/util/number');

describe('number', function() {

  it('isInteger', function() {
    assert.equal(number.isInteger(1), true);
    assert.equal(number.isInteger(3), true);
    assert.equal(number.isInteger(-4), true);
    assert.equal(number.isInteger(0), true);
    assert.equal(number.isInteger(12000), true);
    assert.equal(number.isInteger(-3000), true);

    assert.equal(number.isInteger(1.1), false);
    assert.equal(number.isInteger(0.1), false);
    assert.equal(number.isInteger(-2.3), false);
    assert.equal(number.isInteger(-2.3), false);
  });

  it('isNumber', function() {
    assert.equal(number.isNumber(1), true);
    assert.equal(number.isNumber(2e+3), true);
    assert.equal(number.isNumber(new Number(23)), true);
    assert.equal(number.isNumber(Number(2.3)), true);
    assert.equal(number.isNumber(-23), true);
    assert.equal(number.isNumber(parseFloat('123')), true);

    assert.equal(number.isNumber('23'), false);
    assert.equal(number.isNumber('str'), false);
    assert.equal(number.isNumber(new Date()), false);
    assert.equal(number.isNumber({}), false);
    assert.equal(number.isNumber([]), false);
    assert.equal(number.isNumber(/regexp/), false);
    assert.equal(number.isNumber(true), false);
    assert.equal(number.isNumber(false), false);
    assert.equal(number.isNumber(null), false);
    assert.equal(number.isNumber(undefined), false);
    assert.equal(number.isNumber(), false);
  });

  it('isNumBool', function() {
    assert.equal(number.isNumBool(1), true);
    assert.equal(number.isNumBool(2e+3), true);
    assert.equal(number.isNumBool(new Number(23)), true);
    assert.equal(number.isNumBool(Number(2.3)), true);
    assert.equal(number.isNumBool(-23), true);
    assert.equal(number.isNumBool(parseFloat('123')), true);
    assert.equal(number.isNumBool(true), true);
    assert.equal(number.isNumBool(false), true);

    assert.equal(number.isNumBool('23'), false);
    assert.equal(number.isNumBool('str'), false);
    assert.equal(number.isNumBool(new Date()), false);
    assert.equal(number.isNumBool({}), false);
    assert.equal(number.isNumBool([]), false);
    assert.equal(number.isNumBool(/regexp/), false);
    assert.equal(number.isNumBool(null), false);
    assert.equal(number.isNumBool(undefined), false);
    assert.equal(number.isNumBool(), false);
  });

  it('sign', function() {
    assert.equal(number.sign(1), 1);
    assert.equal(number.sign(3), 1);
    assert.equal(number.sign(4.5), 1);
    assert.equal(number.sign(0.00234), 1);

    assert.equal(number.sign(0), 0);

    assert.equal(number.sign(-1), -1);
    assert.equal(number.sign(-3), -1);
    assert.equal(number.sign(-0.23), -1);
  });

  describe('format', function () {

    it ('should format special values Infinity, NaN', function () {
      assert.equal(number.format(Infinity), 'Infinity');
      assert.equal(number.format(-Infinity), '-Infinity');
      assert.equal(number.format('no number'), 'NaN');
    });

    describe('should apply options', function () {

      it('fixed notation', function () {
        var options = {notation: 'fixed'};
        assert.equal(number.format(0, options), '0');
        assert.equal(number.format(123, options), '123');
        assert.equal(number.format(123.456, options), '123');
        assert.equal(number.format(123.7, options), '124');
        assert.equal(number.format(0.123456, options), '0');
        assert.equal(number.format(123456789, options), '123456789');
        assert.equal(number.format(123456789e+9, options), '123456789000000000');
      });

      it('fixed notation with precision', function () {
        var options = {notation: 'fixed', precision: 2};

        assert.equal(number.format(0, options), '0.00');
        assert.equal(number.format(123, options), '123.00');
        assert.equal(number.format(123.456, options), '123.46');
        assert.equal(number.format(123.7, options), '123.70');
        assert.equal(number.format(0.123456, options), '0.12');
        assert.equal(number.format(123456789, options), '123456789.00');
        assert.equal(number.format(123456789e+9, options), '123456789000000000.00');
      });

      it('scientific notation', function () {
        var options = {notation: 'scientific'};
        assert.equal(number.format(0, options), '0e+0');
        assert.equal(number.format(123, options), '1.23e+2');
        assert.equal(number.format(123.456, options), '1.23456e+2');
        assert.equal(number.format(0.0123, options), '1.23e-2');
        assert.equal(number.format(123456789, options), '1.23456789e+8');
        assert.equal(number.format(123456789e+9, options), '1.23456789e+17');
        assert.equal(number.format(123456789e-9, options), '1.23456789e-1');
      });

      it('scientific notation with precision', function () {
        var options = {notation: 'scientific', precision: 3};
        assert.equal(number.format(123, options), '1.23e+2');
        assert.equal(number.format(123.456, options), '1.23e+2');
        assert.equal(number.format(2, options), '2.00e+0');
      });

      it('auto notation', function () {
        assert.equal(number.format(2/7), '0.2857142857142857');
        assert.equal(number.format(0.10400), '0.104');
        assert.equal(number.format(1000), '1000');

        assert.equal(number.format(0), '0');

        assert.equal(number.format(2.4e-7), '2.4e-7');
        assert.equal(number.format(2.4e-6), '2.4e-6');
        assert.equal(number.format(2.4e-5), '2.4e-5');
        assert.equal(number.format(2.4e-4), '2.4e-4');
        assert.equal(number.format(2.3e-3), '0.0023');
        assert.equal(number.format(2.3e-2), '0.023');
        assert.equal(number.format(2.3e-1), '0.23');
        assert.equal(number.format(2.3), '2.3');
        assert.equal(number.format(2.3e+1), '23');
        assert.equal(number.format(2.3e+2), '230');
        assert.equal(number.format(2.3e+3), '2300');
        assert.equal(number.format(2.3e+4), '23000');
        assert.equal(number.format(2.3e+5), '2.3e+5');
        assert.equal(number.format(2.3e+6), '2.3e+6');

        assert.equal(number.format(1.000000012), '1.000000012');
        assert.equal(number.format(1000000012), '1.000000012e+9');

        assert.equal(number.format(1234567), '1.234567e+6');
        assert.equal(number.format(123456789123456), '1.23456789123456e+14');
        assert.equal(number.format(123456789123456e-14), '1.23456789123456');
        assert.equal(number.format(123456789123456789), '1.2345678912345678e+17');

        assert.equal(number.format(0.1111e+6), '1.111e+5');
        assert.equal(number.format(0.3333e+6), '3.333e+5');
        assert.equal(number.format(0.6666e+6), '6.666e+5');
        assert.equal(number.format(0.9999e+6), '9.999e+5');
        assert.equal(number.format(1.111e+6), '1.111e+6');
      });

      it('auto notation with precision', function () {
        assert.equal(number.format(1/3), '0.3333333333333333');
        assert.equal(number.format(1/3, {precision: 3}), '0.333');
        assert.equal(number.format(1/3, {precision: 4}), '0.3333');
        assert.equal(number.format(1/3, {precision: 5}), '0.33333');

        assert.equal(number.format(1000.000, {precision: 5}), '1000');
        assert.equal(number.format(1000.0010, {precision: 5}), '1000'); // rounded off at 5 digits
        assert.equal(number.format(1234, {precision: 3}), '1230');
        assert.equal(number.format(123.4, {precision: 6}), '123.4');
        assert.equal(number.format(0.001234, {precision: 3}), '0.00123');

        assert.equal(number.format(1234567, {precision: 4}), '1.235e+6');
        assert.equal(number.format(1234567, {precision: 2}), '1.2e+6');
        assert.equal(number.format(123e-6, {precision: 2}), '1.2e-4');
        assert.equal(number.format(123e-6, {precision: 8}), '1.23e-4'); // should remove trailing zeros
        assert.equal(number.format(3e+6, {precision: 8}), '3e+6');        // should remove trailing zeros
        assert.equal(number.format(1234, {precision: 2}), '1200');
      });

      it('auto notation with custom lower and upper bound', function () {
        var options = {
          scientific: {
            lower: 1e-6,
            upper: 1e+9
          }
        };
        assert.equal(number.format(0, options), '0');
        assert.equal(number.format(1234567, options), '1234567');
        assert.equal(number.format(1e+9, options), '1e+9');
        assert.equal(number.format(1e+9-1, options), '999999999');
        assert.equal(number.format(1e-6, options), '0.000001');
        assert.equal(number.format(0.999e-6, options), '9.99e-7');
        assert.equal(number.format(123456789123, options), '1.23456789123e+11');

        assert.equal(number.format(Math.pow(2, 53), {scientific: {upper: 1e+20}}), '9007199254740992');
      });

      it('auto notation with custom precision, lower, and upper bound', function () {
        var options = {
          precision: 4,
          scientific: {
            lower: 1e-6,
            upper: 1e+9
          }
        };

        assert.equal(number.format(0, options), '0');
        assert.equal(number.format(1234567, options), '1235000');
        assert.equal(number.format(1e+9, options), '1e+9');
        assert.equal(number.format(1.1e+9, options), '1.1e+9');
        assert.equal(number.format(1e+9-1, options), '1000000000');
        assert.equal(number.format(1e-6, options), '0.000001');
        assert.equal(number.format(0.999e-6, options), '9.99e-7');
        assert.equal(number.format(123456789123, options), '1.235e+11');
      });

      it('should throw an error on unknown notation', function () {
        assert.throws(function () {
          number.format(123, {notation: 'non existing'})
        });
      });

    });

    it('should format numbers with precision as second parameter', function() {
      assert.equal(number.format(1/3), '0.3333333333333333');
      assert.equal(number.format(1/3, 5), '0.33333');
      assert.equal(number.format(1/3, 3), '0.333');
      assert.equal(number.format(2/3, 3), '0.667');
    });

    it('should format numbers with a custom formatting function', function() {
      function asCurrency (value) {
        return '$' + value.toFixed(2);
      }

      assert.equal(number.format(12.4264, asCurrency), '$12.43');
      assert.equal(number.format(0.1, asCurrency), '$0.10');
      assert.equal(number.format(1.2e+6, asCurrency), '$1200000.00');
    });

    describe('bignumber', function () {
      it('should format big numbers', function() {
        assert.deepEqual(number.format(new BigNumber('2.3')), '2.3');
        assert.deepEqual(number.format(new BigNumber('0.00000003')), '3e-8');
        assert.deepEqual(number.format(new BigNumber('12345678')), '1.2345678e+7');
      });

      it('should format big numbers with given precision', function() {
        assert.deepEqual(number.format(new BigNumber('1.23456'), 3), '1.23');
        assert.deepEqual(number.format(new BigNumber('12345678'), 4), '1.235e+7');
      });

      it('should format big numbers in scientific notation', function() {
        var options = {
          notation: 'scientific'
        };
        assert.deepEqual(number.format(new BigNumber('1.23456'), options), '1.23456e+0');
        assert.deepEqual(number.format(new BigNumber('12345678'), options), '1.2345678e+7');

        options = {
          notation: 'scientific',
          precision: 18
        };
        assert.deepEqual(number.format(new BigNumber(1).div(3), options), '3.33333333333333333e-1');
      });

      it('should format big numbers in fixed notation', function() {
        var options = {
          notation: 'fixed'
        };

        assert.deepEqual(number.format(new BigNumber('1.23456'), options), '1');
        assert.deepEqual(number.format(new BigNumber('1.7'), options), '2');
        assert.deepEqual(number.format(new BigNumber('12345678'), options), '12345678');
        assert.deepEqual(number.format(new BigNumber('12e18'), options), '12000000000000000000');

        options = {
          notation: 'fixed',
          precision: 2
        };
        assert.deepEqual(number.format(new BigNumber('1.23456'), options), '1.23');
        assert.deepEqual(number.format(new BigNumber('12345678'), options), '12345678.00');
        assert.deepEqual(number.format(new BigNumber('12e18'), options), '12000000000000000000.00');
      });
    });

  });

});