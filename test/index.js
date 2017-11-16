const wrap = require('../');
const { expect } = require('chai');

describe('async express mw', () => {
  it('should return a standard express middleware when given an async function', (done) => {
    const mw = wrap(async (req, res, next) => {
      setTimeout(next,100)
    });

    expect(mw).to.be.a('function');
    expect(mw).to.have.lengthOf(3);
    mw(null, null, done);
  });

  it('should work for a non-async standard express middleware', (done) => {
    const mw = wrap((req, res, next) => {
      setTimeout(next,100)
    });

    expect(mw).to.be.a('function');
    expect(mw).to.have.lengthOf(3);
    mw(null, null, done);
  });

  it('should work for partially specified middlewares', () => {
    let called = false;
    const mw = wrap((req) => called = true);

    expect(mw).to.be.a('function');
    expect(mw).to.have.lengthOf(3);

    mw();
    expect(called).to.be.ok;
  });

  it('should handle promise rejections', (done) => {
    const mw = wrap(async (req) => Promise.reject('Failed'));

    mw(null, null, (err) => {
      expect(err).to.be.equal('Failed');
      done();
    });
  });

  it('should return an error middleware', () => {
    let called = false;
    const mw = wrap(async (err, req, res, next) => called = true);

    expect(mw).to.be.a('function');
    expect(mw).to.have.lengthOf(4);

    mw();
    expect(called).to.be.ok;
  });
})
