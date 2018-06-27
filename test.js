self.addEventListener('fetch', event => {
  var html = '…html to serve…';

  var stream = new ReadableStream({
    start(controller) {
      var encoder = new TextEncoder();
      // Our current position in `html`
      var pos = 0;
      // How much to serve on each push
      var chunkSize = 1;

      function push() {
        // Are we done?
        if (pos >= html.length) {
          controller.close();
          return;
        }

        // Push some of the html,
        // converting it into an Uint8Array of utf-8 data
        controller.enqueue(
          encoder.encode(html.slice(pos, pos + chunkSize))
        );

        // Advance the position
        pos += chunkSize;
        // push again in ~5ms
        setTimeout(push, 5);
      }

      // Let's go!
      push();
    }
  });

  event.respondWith(new Response(stream, {
    headers: {'Content-Type': 'text/html'}
  }));
});
