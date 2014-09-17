if(typeof window === 'undefined') {
  assert = require('assert');
  base = process.env.EXPRESS_COV ? require('../lib-cov/base.js') : require('../js/base.js');
  person_gen = process.env.EXPRESS_COV ? require('../lib-cov/person_gen.js') : require('../js/person_gen.js');
}

describe('BirthdayGenerator', function() {
  describe('#call', function() {
    it('define year', function() {
      var year = 1990;
      var gen = new person_gen.BirthdayGenerator({'year': year});
      var actual = gen();
      assert.equal(year, actual.year);
    })

    it('define month', function() {
      var month = 5;
      var gen = new person_gen.BirthdayGenerator({'month': month});
      var actual = gen();
      assert.equal(month, actual.month);
    })

    if('not valid month', function() {
      var gen = new person_gen.BirthdayGenerator({'month': -1});
      var actual = gen();
      assert.equal(1, actual.month);

      var gen = new person_gen.BirthdayGenerator({'month': 13});
      var actual = gen();
      assert.equal(12, actual.month);
    });

    it('define month/day', function() {
      var month = 3;
      var day = 1;
      var gen = new person_gen.BirthdayGenerator({'month': month,
                                                  'day': day});
      var actual = gen();
      assert.equal(month, actual.month);
      assert.equal(day, actual.day);
    });

    it('not valid day', function() {
      var gen = new person_gen.BirthdayGenerator({'month': 2, 'day': -1});
      var actual = gen();
      assert.equal(1, actual.day);

      var gen = new person_gen.BirthdayGenerator({'month': 2, 'day': 30});
      var actual = gen();
      assert.equal(28, actual.day);
    });

    it('random', function() {
      var gen = new person_gen.BirthdayGenerator();
      var data = gen();
      //console.log(data);
    })
  })
})

describe('GenderGenerator', function() {
  describe('#call', function() {
    it('defined', function() {
      var gender = 'm';
      for(var i = 0 ; i < 10 ; i++) {
        var gen = new person_gen.GenderGenerator({'gender': gender});
        var actual = gen();
        assert.equal(gender, actual);
      }
    })
    it('random', function() {
      var gen = new person_gen.GenderGenerator();
      var actual = gen();
      //console.log(actual);
    })
  })
})

describe('NameGenerator', function() {
  describe('#call', function() {
    it('define last', function() {
      var last = '테';
      var gen = new person_gen.NameGenerator({'last': last});
      var actual = gen();
      assert.equal(last, actual.last);
    })

    it('define first', function() {
      var first = '철수';
      var gen = new person_gen.NameGenerator({'first': first});
      var actual = gen();
      assert.equal(first, actual.first);
    })

    it('define gender', function() {
      var gender = 'm';
      var gen = new person_gen.NameGenerator({'gender': gender});
      var actual = gen();

      var gender = 'f';
      var gen = new person_gen.NameGenerator({'gender': gender});
      var actual = gen();
    })

    it('random', function() {
      var gen = new person_gen.NameGenerator();
      var actual = gen();
      //console.log(actual);
    })
  })
})

describe('ssn', function() {
  describe('#str2numList', function() {
    it('run', function() {
      var input = '12-a93s';
      var output = [1, 2, 9, 3];
      assert.deepEqual(output, person_gen.str2numList(input));
    })
  })
})

describe('SSNFilter', function() {
  describe('#apply', function() {
    it('run', function() {
      var filter = new person_gen.SSNFilter();
      assert.equal('123*', filter.apply('1234'));
      assert.equal('12**', filter.apply('1234', 2));
      assert.equal('****', filter.apply('1234', 4));
      assert.equal('****', filter.apply('1234', 10));
      assert.equal('1234', filter.apply('1234', -1));
    })
  })
})

describe('SSNValidator', function() {
  describe('#validate', function() {
    it('success', function() {
      // 수동으로 생성한 샘플
      var dataList = ['901212-1023457'];
      var validator = new person_gen.SSNValidator();
      for(var i = 0 ; i < dataList.length ; ++i) {
        assert.equal(true, validator.validate(dataList[i]));
      }
    })
    it('fail', function() {
      var dataList = [
        '111111-111111',  // 6-6 형태로 입력되서 맞지 않는 경우
        '1111111111111',  // - 없이 입력한 경우
        '901212-1023456',
      ];
      var validator = new person_gen.SSNValidator();
      for(var i = 0 ; i < dataList.length ; ++i) {
        assert.equal(false, validator.validate(dataList[i]));
      }
    })
  })
})

describe('SSNGenerator', function() {
  describe('#generate', function() {
    it('run', function() {
      var birthGen = new person_gen.BirthdayGenerator();
      var data = birthGen();
      var genderGen = new person_gen.GenderGenerator();
      data['gender'] = genderGen();

      var generator = new person_gen.SSNGenerator(data);
      var validator = new person_gen.SSNValidator();

      for(var i = 0 ; i < 10 ; ++i) {
        var val = generator();
        //console.log(val);
        assert.equal(true, validator.validate(val));
      }
    })
  })
})
