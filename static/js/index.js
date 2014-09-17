// 휴대폰/전화번호 항목을 자동생성. HTML에 떄려박기에는 너무 규모가 크다
function createPhoneNumberSequence(size) {
  var data = [];
  var minval = 1000;
  var maxval = 9999;
  for(var i = 0 ; i < size ; ++i) {
    var val = parseInt(Math.random() * (maxval - minval + 1)) + minval;
    data.push(sprintf('%04d', val));
  }
  return data;
}


$(document).ready(function(){
  var DAY_TABLE = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  var basicParam = {
    delay: 200
  };
  var dayParam = {
    delay: 200
  };

  var phoneSelectorList = [
    '.text-machine-tel-1',
    '.text-machine-tel-2',
    '.text-machine-phone-1',
    '.text-machine-phone-2'
  ];
  for(var i = 0 ; i < phoneSelectorList.length ; ++i) {
    var selector = phoneSelectorList[i];
    $(selector).empty();
    var seq = createPhoneNumberSequence(50);
    for(var j = 0 ; j < seq.length ; ++j) {
      var node = document.createElement('div');
      node.innerHTML = seq[j];
      $(selector)[0].appendChild(node);
    }
  }

  var genderSlot = $(".text-machine-gender").slotMachine(basicParam);
  var lastNameSlot = $('.text-machine-last-name').slotMachine(basicParam);

  var maleFirstNameSlot = $('.text-machine-first-name-male').slotMachine(basicParam);
  var femaleFirstNameSlot = $('.text-machine-first-name-female').slotMachine(basicParam);

  var yearSlot = $(".text-machine-year").slotMachine(basicParam);
  var monthSlot = $(".text-machine-month").slotMachine(basicParam);

  var day28Slot = $(".text-machine-day-28").slotMachine(dayParam);
  var day30Slot = $(".text-machine-day-30").slotMachine(dayParam);
  var day31Slot = $(".text-machine-day-31").slotMachine(dayParam);

  var areaSlot = $(".text-machine-area").slotMachine(basicParam);

  var tel0Slot = $(".text-machine-tel-0").slotMachine(basicParam);
  var tel1Slot = $(".text-machine-tel-1").slotMachine(basicParam);
  var tel2Slot = $(".text-machine-tel-2").slotMachine(basicParam);

  var phone0Slot = $(".text-machine-phone-0").slotMachine(basicParam);
  var phone1Slot = $(".text-machine-phone-1").slotMachine(basicParam);
  var phone2Slot = $(".text-machine-phone-2").slotMachine(basicParam);


  function createCard() {
    var slotMachineData = fetchSlotMachineResult();
    var opts = {
      year: slotMachineData.year,
      month: slotMachineData.month,
      day: slotMachineData.day,
      gender: slotMachineData.gender === 0 ? 'm' : 'f'
    };

    var generator = new person_gen.SSNGenerator(opts);
    var value = generator();
    var fakeFilter = new person_gen.FakeSSNFilter();
    value = fakeFilter.apply(value);
    $('.val-jumin').text(value);
  }

  function fetchSlotMachineResult() {
    var gender = genderSlot.active().index % 2;
    var lastName = lastNameSlot.active().el.innerText;
    if(gender === 0) {
      // 숨겻다가 꺼내서 돌리는 슬롯머신은 인덱스 1이 뻑나는데 버그 찾기 귀찮아서 야매로 때움
      var firstNameIdx = maleFirstNameSlot.active().index;
      var firstName = $('.text-machine-first-name-male > > :eq(' + (firstNameIdx) + ')').text();

    } else {
      var firstNameIdx = femaleFirstNameSlot.active().index;
      var firstName = $('.text-machine-first-name-female > > :eq(' + (firstNameIdx) + ')').text();
    }

    var year = yearSlot.active().el.innerText;
    var monthIdx = monthSlot.active().index;
    var month = monthSlot.active().el.innerText;

    if(DAY_TABLE[monthIdx] === 28) {
      var dayIdx = day28Slot.active().index;
      var day = $('.text-machine-day-28 > > :eq(' + dayIdx + ')').text();

    } else if(DAY_TABLE[monthIdx] === 30) {
      var dayIdx = day30Slot.active().index;
      var day = $('.text-machine-day-30 > > :eq(' + dayIdx + ')').text();

    } else if(DAY_TABLE[monthIdx] === 31) {
      var dayIdx = day31Slot.active().index;
      var day = $('.text-machine-day-31 > > :eq(' + dayIdx + ')').text();

    }

    var area = areaSlot.active().index;
    var areaName = areaSlot.active().el.innerText;
    var areaTable = [
      [0, 8],
      [9, 12],
      [13, 15],
      [16, 18],
      [19, 25],
      [26, 34],
      [35, 39],
      [40, 47],
      [48, 54],
      [55, 68],
      [67, 90]
    ];
    var areaMin = areaTable[area][0];
    var areaMax = areaTable[area][1];
    var areaCode = parseInt(Math.random() * (areaMax - areaMin + 1)) + areaMin;

    var data = {
      gender: gender,
      firstName: firstName,
      lastName: lastName,
      year: parseInt(year, 10),
      month: parseInt(month, 10),
      day: parseInt(day, 10),
      area: areaName,
      areaMin: areaMin,
      areaMax: areaMax,
      areaCode: areaCode
    };
    //console.log(data);
    return data;
  }

  function shuffleStep_1() {
    genderSlot.shuffle(1, function() {
      // 성별이 정해지면 이름을 돌릴수 있다.
      // 이름을 돌릴때 성도 같이 돌린다.
      lastNameSlot.shuffle(1, shuffleStep_2);

      var idx = genderSlot.active().index;
      if(idx % 2 === 0) {
        $('.text-machine-first-name-male').css('display', 'inline-block');
        maleFirstNameSlot.shuffle(1);
      } else {
        $('.text-machine-first-name-female').css('display', 'inline-block');
        femaleFirstNameSlot.shuffle(1);
      }
    });
  }
  function shuffleStep_2() {
    // 년, 월을 동시에 돌린다. 월이 정해지면 날을 돌릴수 있다.
    yearSlot.shuffle(1);
    monthSlot.shuffle(1, function() {
      // 가능한 날의 범위를 다시 잡는다
      var idx = monthSlot.active().index;
      var day = DAY_TABLE[idx];

      if(day === 28) {
        $('.text-machine-day-28').css('display', 'inline-block');
        day28Slot.shuffle(1, shuffleStep_3);
      } else if(day === 30) {
        $('.text-machine-day-30').css('display', 'inline-block');
        day30Slot.shuffle(1, shuffleStep_3);
      } else if(day === 31) {
        $('.text-machine-day-31').css('display', 'inline-block');
        day31Slot.shuffle(1, shuffleStep_3);
      }
    });
  }

  function shuffleStep_3() {
    // 지역은 독립정보
    areaSlot.shuffle(1, shuffleStep_4);
  }

  function shuffleStep_4() {
    phone0Slot.shuffle(1);
    phone1Slot.shuffle(1);
    phone2Slot.shuffle(1, shuffleStep_5);
  }

  function shuffleStep_5() {
    tel0Slot.shuffle(1);
    tel1Slot.shuffle(1);
    tel2Slot.shuffle(1, shuffleStep_6);
  }

  function shuffleStep_6() {
    createCard();
  }

  $('.btn-run-slot-machine').click(function() {
    /*
      그럴싸한 데이터 생성 + 적절한 재미를 위해서
      슬롯머신을 동시에 전부 돌리지 않는다. 의존성 순서대로 하나씩 돌린다
    */
    $('.text-machine-first-name-male').hide();
    $('.text-machine-first-name-female').hide();

    $('.text-machine-day-28').hide();
    $('.text-machine-day-30').hide();
    $('.text-machine-day-31').hide();

    shuffleStep_1();
  });
});
