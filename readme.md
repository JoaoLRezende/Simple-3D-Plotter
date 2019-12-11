If you have Python installed, one way to run this is executing `python3 -m http.server` to start a server and then pointing a web browser to http://localhost:8000/.  
You probably can simply double-click `index.html` instead, but then you likely won't see the axis ticks due to CORS-related errors.

Some examples of plottable functions:
- `sqrt(abs(x))*sin(5*t)*abs(x)*0.2` (birdie)
- `sin(x*t*2)`
- `sin(x*t) + sin(z*t)`
- `sin(10*((x/3)+(z/3))-2*t)/10)` (subtle waves)
- `sin(10*((x/3)**2+(z/3)**2)-2*t)/10` (ripples)
- `1/(15*((x/10)**2+(z/10)**2))+sin(10*((x/3)**2+(z/3)**2)-10*t)/10` (milkshake falling from the sky)
- `1/(15*((x/10)**2+(z/10)**2))+sin(10*((x/3)**2+(z/3)**2)+10*t)/10` (milkshake being sucked up into the sky)
- `(x**2+z**2)**2 + sin(t*5)*5` (a phallic object moving up and down)
- `Math.floor(x)` (stairs)