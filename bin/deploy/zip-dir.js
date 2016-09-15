const { WritableStreamBuffer } = require('stream-buffers');
const archiver = require('archiver');

module.exports = (dir, callback) => {
  const output = new WritableStreamBuffer({
    initialSize: (100 * 1024),    // start at 100 kilobytes.
    incrementAmount: (10 * 1024), // grow by 10 kilobytes each time buffer overflows.);
  });
  const archive = archiver('zip');
  archive.on('end', () => {
    callback(null, output);
  });
  archive.on('error', callback);
  archive.pipe(output);
  archive.directory(dir, '/');
  archive.finalize();
};
