var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () =>{
    var from = 'Atul';
    var text = 'Some message';
    var message = generateMessage(from,text);

    expect(message.createdAt).to.be.('number');
    expect(message).toInclude({from,text});
  });
});
