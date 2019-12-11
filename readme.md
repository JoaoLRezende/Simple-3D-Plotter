One way to run this, if you have Python installed, is executing `python3 -m http.server` to start a server and then pointing a web browser to http://localhost:8000/.

You probably can simply double-click `index.html` instead, but then you likely won't see the axis markers due to CORS-related errors.

Some examples of plottable functions:
- `sqrt(abs(x))*sin(5*t)*abs(x)*0.2` (birdie)
- `sin(x*t*2)`
- `sin(x*t) + sin(z*t)`
