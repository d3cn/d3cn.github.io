# d3-force

这个模块为模拟对粒子的物理作用力实现了一个速度韦尔莱（[velocity Verlet](https://en.wikipedia.org/wiki/Verlet_integration)）数值积分器。模拟比较简单：它假定每一步都是一个恒定的单位时间步Δ*t* = 1，所有粒子都是一个恒定的单位质量*m* = 1。如此，作用在质点上的一个力*F*等于在时间间隔Δ*t*的一个恒定的加速度，可通过简单地增加粒子的速度进行模拟，粒子的位置也跟着改变。

在信息可视化领域，物理模拟对研究网络（[networks](http://bl.ocks.org/mbostock/ad70335eeef6d167bc36fd3c04378048)）和层次（[hierarchies](http://bl.ocks.org/mbostock/95aa92e2f4e8345aaa55a4a94d41ce37)）都是有用处的！

[<img alt="Force Dragging III" src="https://raw.githubusercontent.com/d3/d3-force/master/img/graph.png" width="420" height="219">](http://bl.ocks.org/mbostock/ad70335eeef6d167bc36fd3c04378048)[<img alt="Force-Directed Tree" src="https://raw.githubusercontent.com/d3/d3-force/master/img/tree.png" width="420" height="219">](http://bl.ocks.org/mbostock/95aa92e2f4e8345aaa55a4a94d41ce37)

你也可以模拟边界碰撞，如气泡图（[bubble charts](http://www.nytimes.com/interactive/2012/09/06/us/politics/convention-word-counts.html)）或beeswam块（[beeswam plots](http://bl.ocks.org/mbostock/6526445e2b44303eebf21da3b6627320)）：

[<img alt="Collision Detection" src="https://raw.githubusercontent.com/d3/d3-force/master/img/collide.png" width="420" height="219">](http://bl.ocks.org/mbostock/31ce330646fa8bcb7289ff3b97aab3f5)[<img alt="Beeswarm" src="https://raw.githubusercontent.com/d3/d3-force/master/img/beeswarm.png" width="420" height="219">](http://bl.ocks.org/mbostock/6526445e2b44303eebf21da3b6627320)

你甚至可以使用它作为一个基本的物理引擎，比如说模拟布料：

[<img alt="Force-Directed Lattice" src="https://raw.githubusercontent.com/d3/d3-force/master/img/lattice.png" width="480" height="250">](http://bl.ocks.org/mbostock/1b64ec067fcfc51e7471d944f51f1611)

要使用这个模块，你需要由一个节点（[nodes](#simulation_nodes)）数组创建一个模拟（[simulation](#simulation)），和构造所需要的力（[forces](#simulation_force)）。然后监听（[listen](#simulation_on)）tick事件来渲染更新的节点，在你首选的图形系统上，比如Canvas或SVG。

## 安装

如果你使用NPM，`npm install d3-force`。否则，下载最新发布版本（[latest release](https://github.com/d3/d3-force/releases/latest)）。你也可以直接从[d3js.org](https://d3js.org)加载，无论是作为一个独立的库（[standalone library](https://d3js.org/d3-force.v1.min.js)）或作为[D3 4.0](https://github.com/d3/d3)的一部分。AMD，CommonJS，和普通环境是被支持的。在普通环境里，一个`d3_force`全局变量会被输出：

```html
<script src="https://d3js.org/d3-collection.v1.min.js"></script>
<script src="https://d3js.org/d3-dispatch.v1.min.js"></script>
<script src="https://d3js.org/d3-quadtree.v1.min.js"></script>
<script src="https://d3js.org/d3-timer.v1.min.js"></script>
<script src="https://d3js.org/d3-force.v1.min.js"></script>
<script>

var simulation = d3.forceSimulation(nodes);

</script>
```

[Try d3-force in your browser.](https://tonicdev.com/npm/d3-force)

## API参考

### Simulation（模拟）

<a name="forceSimulation" href="#forceSimulation">#</a> d3.<b>forceSimulation</b>([<i>nodes</i>])

Creates a new simulation with the specified array of [*nodes*](#simulation_nodes) and no [forces](#simulation_force). If *nodes* is not specified, it defaults to the empty array. The simulator [starts](#simulation_restart) automatically; use [*simulation*.on](#simulation_on) to listen for tick events as the simulation runs. If you wish to run the simulation manually instead, call [*simulation*.stop](#simulation_stop), and then call [*simulation*.tick](#simulation_tick) as desired.

使用指定的节点（[*nodes*](#simulation_nodes)）数组创建一个新模拟，此时无[forces](#simulation_force)作用。如果没有指定nodes参数，会默认为空数组。模拟器自动启动；使用[*simulation*.on](#simulation_on)监听模拟运行时的tick事件。如果想手动运行模拟，你可以调用[*simulation*.stop](#simulation_stop)，然后在需要的时候调用[*simulation*.tick](#simulation_tick)。

<a name="simulation_restart" href="#simulation_restart">#</a> <i>simulation</i>.<b>restart</b>()

Restarts the simulation’s internal timer and returns the simulation. In conjunction with [*simulation*.alphaTarget](#simulation_alphaTarget) or [*simulation*.alpha](#simulation_alpha), this method can be used to “reheat” the simulation during interaction, such as when dragging a node, or to resume the simulation after temporarily pausing it with [*simulation*.stop](#simulation_stop).

重新启动simulation的内部timer，然后返回simulation。结合[*simulation*.alphaTarget](#simulation_alphaTarget)或[*simulation*.alpha](#simulation_alpha)，这个方法可以用作在交互期间“重新加热”simulation，比如当拖动一个节点，或者在使用[*simulation*.stop](#simulation_stop)临时停止它后恢复simulation。

<a name="simulation_stop" href="#simulation_stop">#</a> <i>simulation</i>.<b>stop</b>()

Stops the simulation’s internal timer, if it is running, and returns the simulation. If the timer is already stopped, this method does nothing. This method is useful for running the simulation manually; see [*simulation*.tick](#simulation_tick).

停止simulation的内部timer，如果它正在运行，就返回simulation。如果timer已经停止，这个方法不会做任何事情。这个方法对手动运行simulation很有用处；查看[*simulation*.tick](#simulation_tick)。

<a name="simulation_tick" href="#simulation_tick">#</a> <i>simulation</i>.<b>tick</b>()

Increments the current [*alpha*](#simulation_alpha) by ([*alphaTarget*](#simulation_alphaTarget) - *alpha*) × [*alphaDecay*](#simulation_alphaDecay); then invokes each registered [force](#simulation_force), passing the new *alpha*; then decrements each [node](#simulation_nodes)’s velocity by *velocity* × [*velocityDecay*](#simulation_velocityDecay); lastly increments each node’s position by *velocity*.

为当前的[*alpha*](#simulation_alpha)增加([*alphaTarget*](#simulation_alphaTarget) - *alpha*) × [*alphaDecay*](#simulation_alphaDecay)；然后用新的*alpha*调用每个注册了的[force](#simulation_force)；然后为每个节点（[node](#simulation_nodes)）的velocity减少*velocity* × [*velocityDecay*](#simulation_velocityDecay)；最后为每个节点的位置增加*velocity*。

This method does not dispatch [events](#simulation_on); events are only dispatched by the internal timer when the simulation is started automatically upon [creation](#forceSimulation) or by calling [*simulation*.restart](#simulation_restart). The natural number of ticks when the simulation is started is ⌈*log*([*alphaMin*](#simulation_alphaMin)) / *log*(1 - [*alphaDecay*](#simulation_alphaDecay))⌉; by default, this is 300.

这个方法不会调度[events](#simulation_on)；events只会被内部timer调度，当simulation通过[creation](#forceSimulation)自动启动，或者通过调用[*simulation*.restart](#simulation_restart)启动。simulation被启动时的自然数ticks为⌈*log*([*alphaMin*](#simulation_alphaMin)) / *log*(1 - [*alphaDecay*](#simulation_alphaDecay))⌉；默认情况下，这个值为300。

<a name="simulation_nodes" href="#simulation_nodes">#</a> <i>simulation</i>.<b>nodes</b>([<i>nodes</i>])

If *nodes* is specified, sets the simulation’s nodes to the specified array of objects, initializing their positions and velocities if necessary, and then [re-initializes](#force_initialize) any bound [forces](#simulation_force); returns the simulation. If *nodes* is not specified, returns the simulation’s array of nodes as specified to the [constructor](#forceSimulation).

如果*nodes*参数被指定，设置simulation的节点为指定的对象数组，如果需要，初始化它们的位置和速度，然后重新初始化（[re-initializes](#force_initialize)）任何绑定的forces](#simulation_force)；返回simulation。如果*nodes*没有被指定，返回simulation构造（[constructor](#forceSimulation)）时指定的节点数组。

Each *node* must be an object. The following properties are assigned by the simulation:

* `index` - the node’s zero-based index into *nodes*
* `x` - the node’s current *x*-position
* `y` - the node’s current *y*-position
* `vx` - the node’s current *x*-velocity
* `vy` - the node’s current *y*-velocity

每个*node*必须是一个对象。以下的属性通过simulation指定：

* `index` - 给*nodes*设定以0为基的索引值
* `x` - 节点当前的*x*位置
* `y` - 节点当前的*y*位置
* `vx` - 节点当前的*x*速度
* `vy` - 节点当前的*y*速度

The position ⟨*x*,*y*⟩ and velocity ⟨*vx*,*vy*⟩ may be subsequently modified by [forces](#forces) and by the simulation. If either *vx* or *vy* is NaN, the velocity is initialized to ⟨0,0⟩. If either *x* or *y* is NaN, the position is initialized in a [phyllotaxis arrangement](http://bl.ocks.org/mbostock/11478058), so chosen to ensure a deterministic, uniform distribution around the origin.

位置⟨*x*,*y*⟩和速度⟨*vx*,*vy*⟩可能随后会被[forces](#forces)和simulation修改。如果*vx*或*vy*的值为NaN，则速度会被初始化为⟨0,0⟩。如果*x*或*y*的值为NaN，则位置会在一个叶序排列（[phyllotaxis arrangement](http://bl.ocks.org/mbostock/11478058)）中被初始化，所以选择确保一个确定的值，统一围绕原点分布。

To fix a node in a given position, you may specify two additional properties:

* `fx` - the node’s fixed *x*-position
* `fy` - the node’s fixed *y*-position

为了固定一个已经给定位置的节点，你可以指定两个附加的属性：

* `fx` - 节点固定的*x*位置
* `fy` - 节点固定的*y*位置

At the end of each [tick](#simulation_tick), after the application of any forces, a node with a defined *node*.fx has *node*.x reset to this value and *node*.vx set to zero; likewise, a node with a defined *node*.fy has *node*.y reset to this value and *node*.vy set to zero. To unfix a node that was previously fixed, set *node*.fx and *node*.fy to null, or delete these properties.

在每次[tick](#simulation_tick)的最后，当应用了任何forces后，一个被定义了*node*.fx的节点，*node*.x会重置为此值，*node*.vx会设置为0；同样，一个被定义了*node*.fy的节点，*node*.y会重置为此值，*node*.vy会设置为0。当想要取消固定一个先前被固定了的节点，设置*node*.fx和*node*.fy为null，或者删除这些属性即可。

If the specified array of *nodes* is modified, such as when nodes are added to or removed from the simulation, this method must be called again with the new (or changed) array to notify the simulation and bound forces of the change; the simulation does not make a defensive copy of the specified array.

如果指定的*nodes*数组被修改，比如当节点被从simulation增加或移除，这个方法必须被以新的（或者修改过的）数组为参数再次调用，来通知simulation和绑定的forces这个改变。simulation不会产生指定数组的一个冲突的复制。

<a name="simulation_alpha" href="#simulation_alpha">#</a> <i>simulation</i>.<b>alpha</b>([<i>alpha</i>])

If *alpha* is specified, sets the current alpha to the specified number in [0,1] and returns this simulation. If *alpha* is not specified, returns the current alpha value, which defaults to 1.

如果*alpha*被指定，则设置当前的alpha为指定的[0,1]区间的值，并返回simulation。如果*alpha*没有被指定，则返回当前的alpha值，默认为1。

<a name="simulation_alphaMin" href="#simulation_alphaMin">#</a> <i>simulation</i>.<b>alphaMin</b>([<i>min</i>])

If *min* is specified, sets the minimum *alpha* to the specified number in [0,1] and returns this simulation. If *min* is not specified, returns the current minimum *alpha* value, which defaults to 0.001. The simulation’s internal timer stops when the current [*alpha*](#simulation_alpha) is less than the minimum *alpha*. The default [alpha decay rate](#simulation_alphaDecay) of ~0.0228 corresponds to 300 iterations.

如果*min*被指定，则设置*alpha*的最小值为指定的[0,1]区间的值，并返回simulation。如果*min*没有被指定，则返回当前的*alpha*最小值，默认为0.001。当当前[*alpha*](#simulation_alpha)小于*alpha*最小值时，simulation的内部timer会停止。默认的~0.0228的alpha衰减率（[alpha decay rate](#simulation_alphaDecay)）相当于300次。

<a name="simulation_alphaDecay" href="#simulation_alphaDecay">#</a> <i>simulation</i>.<b>alphaDecay</b>([<i>decay</i>])

If *decay* is specified, sets the [*alpha*](#simulation_alpha) decay rate to the specified number in [0,1] and returns this simulation. If *decay* is not specified, returns the current *alpha* decay rate, which defaults to 0.0228… = 1 - *pow*(0.001, 1 / 300) where 0.001 is the default [minimum *alpha*](#simulation_alphaMin).

如果*decay*被指定，则设置[*alpha*](#simulation_alpha)衰减率为指定的[0,1]区间的值，并返回simulation。如果*decay*没有被指定，则返回当前的*alpha*衰减率，默认为0.0228… = 1 - *pow*(0.001, 1 / 300)，其中0.001是默认的alpha最小值（[minimum *alpha*](#simulation_alphaMin)）。

The alpha decay rate determines how quickly the current alpha interpolates towards the desired [target *alpha*](#simulation_alphaTarget); since the default target *alpha* is zero, by default this controls how quickly the simulation cools. Higher decay rates cause the simulation to stabilize more quickly, but risk getting stuck in a local minimum; lower values cause the simulation to take longer to run, but typically converge on a better layout. To have the simulation run forever at the current *alpha*, set the *decay* rate to zero; alternatively, set a [target *alpha*](#simulation_alphaTarget) greater than the [minimum *alpha*](#simulation_alphaMin).

alpha衰减率决定了当前alpha向想要的目标alpha（[target *alpha*](#simulation_alphaTarget)）改变得有多快；由于默认目标*alpha*为0，一般这个值控制simulation有多快变冷（译者：不再改变）。更高的衰减率使simulation更快的稳定，但是在一个局部最小值的情况下会有风险变得卡住（译者不确定翻译正确）；更低的值使simulation花费更长时间来运行，但是通常会在一个不错的布局上聚集。如果想让simulation永远运行在当前*alpha*，设置衰减（*decay*）率为0即可；另外，设置一个目标alpha（[target *alpha*](#simulation_alphaTarget)）要好于设置最小alpha（[minimum *alpha*](#simulation_alphaMin)）。 

<a name="simulation_alphaTarget" href="#simulation_alphaTarget">#</a> <i>simulation</i>.<b>alphaTarget</b>([<i>target</i>])

If *target* is specified, sets the current target [*alpha*](#simulation_alpha) to the specified number in [0,1] and returns this simulation. If *target* is not specified, returns the current target alpha value, which defaults to 0.

如果*target*被指定，则设置当前目标[*alpha*](#simulation_alpha)为指定的0,1]区间的值，并返回simulation。如果*target*没有被指定，则返回当前目标alpha，默认为0。

<a name="simulation_velocityDecay" href="#simulation_velocityDecay">#</a> <i>simulation</i>.<b>velocityDecay</b>([<i>decay</i>])

If *decay* is specified, sets the velocity decay factor to the specified number in [0,1] and returns this simulation. If *decay* is not specified, returns the current velocity decay factor, which defaults to 0.4. The decay factor is akin to atmospheric friction; after the application of any forces during a [tick](#simulation_tick), each node’s velocity is multiplied by 1 - *decay*. As with lowering the [alpha decay rate](#simulation_alphaDecay), less velocity decay may converge on a better solution, but risks numerical instabilities and oscillation.

如果*decay*被指定，则设置速度衰减因子为指定的0,1]区间的值，并返回simulation。如果*decay*没有被指定，则返回当前速度衰减因子，默认为0.4。衰减因子类似于大气摩擦；当在一个[tick](#simulation_tick)内应用了任何forces，每个节点的速度会被乘以1 - *decay*。和降低alpha衰减率（[alpha decay rate](#simulation_alphaDecay)）一样，更小的速度衰减可能在一个不错的方案上聚集，但是会有数值不稳定和震荡的风险。

<a name="simulation_force" href="#simulation_force">#</a> <i>simulation</i>.<b>force</b>(<i>name</i>[, <i>force</i>])

If *force* is specified, assigns the [force](#forces) for the specified *name* and returns this simulation. If *force* is not specified, returns the force with the specified name, or undefined if there is no such force. (By default, new simulations have no forces.) For example, to create a new simulation to layout a graph, you might say:

如果*force*被指定，则为[force](#forces)分派指定的名称（*name*），并返回simulation。如果*force*没有被指定，则返回指定名称的force，当没有这样的force时，返回undefined。（默认地，新创建的simulation没有foces。）例如，为了创建一个新simulation来布局一个图形，你应该这样：

```js
var simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody())
    .force("link", d3.forceLink(links))
    .force("center", d3.forceCenter());
```

<a name="simulation_find" href="#simulation_find">#</a> <i>simulation</i>.<b>find</b>(<i>x</i>, <i>y</i>[, <i>radius</i>])

Returns the node closest to the position ⟨*x*,*y*⟩ with the given search *radius*. If *radius* is not specified, it defaults to infinity. If there is no node within the search area, returns undefined.

<a name="simulation_on" href="#simulation_on">#</a> <i>simulation</i>.<b>on</b>(<i>typenames</i>, [<i>listener</i>])

If *listener* is specified, sets the event *listener* for the specified *typenames* and returns this simulation. If an event listener was already registered for the same type and name, the existing listener is removed before the new listener is added. If *listener* is null, removes the current event listeners for the specified *typenames*, if any. If *listener* is not specified, returns the first currently-assigned listener matching the specified *typenames*, if any. When a specified event is dispatched, each *listener* will be invoked with the `this` context as the simulation.

The *typenames* is a string containing one or more *typename* separated by whitespace. Each *typename* is a *type*, optionally followed by a period (`.`) and a *name*, such as `tick.foo` and `tick.bar`; the name allows multiple listeners to be registered for the same *type*. The *type* must be one of the following:

* `tick` - after each [tick](#simulation_tick) of the simulation.
* `end` - after the simulation ends, when *alpha* < [*alphaMin*](#simulation_alphaMin).

See [*dispatch*.on](https://github.com/d3/d3-dispatch#dispatch_on) for details.

### Forces

A *force* is simply a function that modifies nodes’ positions or velocities; in this context, a *force* can apply a classical physical force such as electrical charge or gravity, or it can resolve a geometric constraint, such as keeping nodes within a bounding box or keeping linked nodes a fixed distance apart. For example, a simple positioning force that moves nodes towards the origin ⟨0,0⟩ might be implemented as:

```js
function force(alpha) {
  for (var i = 0, n = nodes.length, node, k = alpha * 0.1; i < n; ++i) {
    node = nodes[i];
    node.vx -= node.x * k;
    node.vy -= node.y * k;
  }
}
```

Forces typically read the node’s current position ⟨*x*,*y*⟩ and then add to (or subtract from) the node’s velocity ⟨*vx*,*vy*⟩. However, forces may also “peek ahead” to the anticipated next position of the node, ⟨*x* + *vx*,*y* + *vy*⟩; this is necessary for resolving geometric constraints through [iterative relaxation](https://en.wikipedia.org/wiki/Relaxation_\(iterative_method\)). Forces may also modify the position directly, which is sometimes useful to avoid adding energy to the simulation, such as when recentering the simulation in the viewport.

Simulations typically compose multiple forces as desired. This module provides several for your enjoyment:

* [Centering](#centering)
* [Collision](#collision)
* [Links](#links)
* [Many-Body](#many-body)
* [Positioning](#positioning)

Forces may optionally implement [*force*.initialize](#force_initialize) to receive the simulation’s array of nodes.

<a name="_force" href="#_force">#</a> <i>force</i>(<i>alpha</i>)

Applies this force, optionally observing the specified *alpha*. Typically, the force is applied to the array of nodes previously passed to [*force*.initialize](#force_initialize), however, some forces may apply to a subset of nodes, or behave differently. For example, [d3.forceLink](#links) applies to the source and target of each link.

<a name="force_initialize" href="#force_initialize">#</a> <i>force</i>.<b>initialize</b>(<i>nodes</i>)

Assigns the array of *nodes* to this force. This method is called when a force is bound to a simulation via [*simulation*.force](#simulation_force) and when the simulation’s nodes change via [*simulation*.nodes](#simulation_nodes). A force may perform necessary work during initialization, such as evaluating per-node parameters, to avoid repeatedly performing work during each application of the force.

#### Centering

The centering force translates nodes uniformly so that the mean position of all nodes (the center of mass if all nodes have equal weight) is at the given position ⟨[*x*](#center_x),[*y*](#center_y)⟩. This force modifies the positions of nodes on each application; it does not modify velocities, as doing so would typically cause the nodes to overshoot and oscillate around the desired center. This force helps keeps nodes in the center of the viewport, and unlike the [positioning force](#positioning), it does not distort their relative positions.

<a name="forceCenter" href="#forceCenter">#</a> d3.<b>forceCenter</b>([<i>x</i>, <i>y</i>])

Creates a new centering force with the specified [*x*-](#center_x) and [*y*-](#center_y) coordinates. If *x* and *y* are not specified, they default to ⟨0,0⟩.

<a name="center_x" href="#center_x">#</a> <i>center</i>.<b>x</b>([<i>x</i>])

If *x* is specified, sets the *x*-coordinate of the centering position to the specified number and returns this force. If *x* is not specified, returns the current *x*-coordinate, which defaults to zero.

<a name="center_y" href="#center_y">#</a> <i>center</i>.<b>y</b>([<i>y</i>])

If *y* is specified, sets the *y*-coordinate of the centering position to the specified number and returns this force. If *y* is not specified, returns the current *y*-coordinate, which defaults to zero.

#### Collision

The collision force treats nodes as circles with a given [radius](#collide_radius), rather than points, and prevents nodes from overlapping. More formally, two nodes *a* and *b* are separated so that the distance between *a* and *b* is at least *radius*(*a*) + *radius*(*b*). To reduce jitter, this is by default a “soft” constraint with a configurable [strength](#collide_strength) and [iteration count](#collide_iterations).

<a name="forceCollide" href="#forceCollide">#</a> d3.<b>forceCollide</b>([<i>radius</i>])

Creates a new circle collision force with the specified [*radius*](#collide_radius). If *radius* is not specified, it defaults to the constant one for all nodes.

<a name="collide_radius" href="#collide_radius">#</a> <i>collide</i>.<b>radius</b>([<i>radius</i>])

If *radius* is specified, sets the radius accessor to the specified number or function, re-evaluates the radius accessor for each node, and returns this force. If *radius* is not specified, returns the current radius accessor, which defaults to:

```js
function radius() {
  return 1;
}
```

The radius accessor is invoked for each [node](#simulation_nodes) in the simulation, being passed the *node* and its zero-based *index*. The resulting number is then stored internally, such that the radius of each node is only recomputed when the force is initialized or when this method is called, and not on every application of the force.

<a name="collide_strength" href="#collide_strength">#</a> <i>collide</i>.<b>strength</b>([<i>strength</i>])

If *strength* is specified, sets the force strength to the specified number in [0,1] and returns this force. If *strength* is not specified, returns the current strength which defaults to 0.7.

Overlapping nodes are resolved through iterative relaxation. For each node, the other nodes that are anticipated to overlap at the the at the next tick (using the anticipated positions ⟨*x* + *vx*,*y* + *vy*⟩) are determined; the node’s velocity is then modified to push the node out of each overlapping node. The change in velocity is dampened by the force’s strength such that the resolution of simultaneous overlaps can be blended together to find a stable solution.

<a name="collide_iterations" href="#collide_iterations">#</a> <i>collide</i>.<b>iterations</b>([<i>iterations</i>])

If *iterations* is specified, sets the number of iterations per application to the specified number and returns this force. If *iterations* is not specified, returns the current iteration count which defaults to 1. Increasing the number of iterations greatly increases the rigidity of the constraint and avoids partial overlap of nodes, but also increases the runtime cost to evaluate the force.

#### Links

The link force pushes linked nodes together or apart according to the desired [link distance](#link_distance). The strength of the force is proportional to the difference between the linked nodes’ distance and the target distance, similar to a spring force.

<a name="forceLink" href="#forceLink">#</a> d3.<b>forceLink</b>([<i>links</i>])

Creates a new link force with the specified *links* and default parameters. If *links* is not specified, it defaults to the empty array.

<a name="link_links" href="#link_links">#</a> <i>link</i>.<b>links</b>([<i>links</i>])

If *links* is specified, sets the array of links associated with this force, recomputes the [distance](#link_distance) and [strength](#link_strength) parameters for each link, and returns this force. If *links* is not specified, returns the current array of links, which defaults to the empty array.

Each link is an object with the following properties:

* `source` - the link’s source node; see [*simulation*.nodes](#simulation_nodes)
* `target` - the link’s target node; see [*simulation*.nodes](#simulation_nodes)
* `index` - the zero-based index into *links*, assigned by this method

For convenience, a link’s source and target properties may be initialized using numeric or string identifiers rather than object references; see [*link*.id](#link_id).

If the specified array of *links* is modified, such as when links are added to or removed from the simulation, this method must be called again with the new (or changed) array to notify the force of the change; the force does not make a defensive copy of the specified array.

<a name="link_id" href="#link_id">#</a> <i>link</i>.<b>id</b>([<i>id</i>])

If *id* is specified, sets the node id accessor to the specified function and returns this force. If *id* is not specified, returns the current node id accessor, which defaults to the numeric index of the node:

```js
function id(d, i) {
  return i;
}
```

The default id accessor allows each link’s source and target to be specified as a zero-based index into the [nodes](#simulation_nodes) array. For example:

```js
var nodes = [
  {"id": "Alice"},
  {"id": "Bob"},
  {"id": "Carol"}
];

var links = [
  {"source": 0, "target": 1}, // Alice → Bob
  {"source": 1, "target": 2} // Bob → Carol
];
```

Now consider a different id accessor that returns a string:

```js
function id(d) {
  return d.id;
}
```

With this accessor, you can use named sources and targets:

```js
var nodes = [
  {"id": "Alice"},
  {"id": "Bob"},
  {"id": "Carol"}
];

var links = [
  {"source": "Alice", "target": "Bob"},
  {"source": "Bob", "target": "Carol"}
];
```

This is particularly useful when representing graphs in JSON, as JSON does not allow references. See [this example](http://bl.ocks.org/mbostock/f584aa36df54c451c94a9d0798caed35).

The id accessor is invoked for each node whenever the force is initialized, as when the [nodes](#simulation_nodes) or [links](#link_links) change, being passed the node and its zero-based index.

<a name="link_distance" href="#link_distance">#</a> <i>link</i>.<b>distance</b>([<i>distance</i>])

If *distance* is specified, sets the distance accessor to the specified number or function, re-evaluates the distance accessor for each link, and returns this force. If *distance* is not specified, returns the current distance accessor, which defaults to:

```js
function distance() {
  return 30;
}
```

The distance accessor is invoked for each [link](#link_links), being passed the *link* and its zero-based *index*. The resulting number is then stored internally, such that the distance of each link is only recomputed when the force is initialized or when this method is called, and not on every application of the force.

<a name="link_strength" href="#link_strength">#</a> <i>link</i>.<b>strength</b>([<i>strength</i>])

If *strength* is specified, sets the strength accessor to the specified number or function, re-evaluates the strength accessor for each link, and returns this force. If *strength* is not specified, returns the current strength accessor, which defaults to:

```js
function strength(link) {
  return 1 / Math.min(count(link.source), count(link.target));
}
```

Where *count*(*node*) is a function that returns the number of links with the given node as a source or target. This default was chosen because it automatically reduces the strength of links connected to heavily-connected nodes, improving stability.

The strength accessor is invoked for each [link](#link_links), being passed the *link* and its zero-based *index*. The resulting number is then stored internally, such that the strength of each link is only recomputed when the force is initialized or when this method is called, and not on every application of the force.

<a name="link_iterations" href="#link_iterations">#</a> <i>link</i>.<b>iterations</b>([<i>iterations</i>])

If *iterations* is specified, sets the number of iterations per application to the specified number and returns this force. If *iterations* is not specified, returns the current iteration count which defaults to 1. Increasing the number of iterations greatly increases the rigidity of the constraint and is useful for [complex structures such as lattices](http://bl.ocks.org/mbostock/1b64ec067fcfc51e7471d944f51f1611), but also increases the runtime cost to evaluate the force.

#### Many-Body

The many-body (or *n*-body) force applies mutally amongst all [nodes](#simulation_nodes). It can be used to simulate gravity (attraction) if the [strength](#manyBody_strength) is positive, or electrostatic charge (repulsion) if the strength is negative. This implementation uses quadtrees and the [Barnes–Hut approximation](https://en.wikipedia.org/wiki/Barnes–Hut_simulation) to greatly improve performance; the accuracy can be customized using the [theta](#manyBody_theta) parameter.

Unlike links, which only affect two linked nodes, the charge force is global: every node affects every other node, even if they are on disconnected subgraphs.

<a name="forceManyBody" href="#forceManyBody">#</a> d3.<b>forceManyBody</b>()

Creates a new many-body force with the default parameters.

<a name="manyBody_strength" href="#manyBody_strength">#</a> <i>manyBody</i>.<b>strength</b>([<i>strength</i>])

If *strength* is specified, sets the strength accessor to the specified number or function, re-evaluates the strength accessor for each node, and returns this force. A positive value causes nodes to attract each other, similar to gravity, while a negative value causes nodes to repel each other, similar to electrostic charge. If *strength* is not specified, returns the current strength accessor, which defaults to:

```js
function strength() {
  return -30;
}
```

The strength accessor is invoked for each [node](#simulation_nodes) in the simulation, being passed the *node* and its zero-based *index*. The resulting number is then stored internally, such that the strength of each node is only recomputed when the force is initialized or when this method is called, and not on every application of the force.

<a name="manyBody_theta" href="#manyBody_theta">#</a> <i>manyBody</i>.<b>theta</b>([<i>theta</i>])

If *theta* is specified, sets the Barnes–Hut approximation criterion to the specified number and returns this force. If *theta* is not specified, returns the current value, which defaults to 0.9.

To accelerate computation, this force implements the [Barnes–Hut approximation](http://en.wikipedia.org/wiki/Barnes–Hut_simulation) which takes O(*n* log *n*) per application where *n* is the number of [nodes](#simulation_nodes). For each application, a [quadtree](https://github.com/d3/d3-quadtree) stores the current node positions; then for each node, the combined force of all other nodes on the given node is computed. For a cluster of nodes that is far away, the charge force can be approximated by treating the cluster as a single, larger node. The *theta* parameter determines the accuracy of the approximation: if the ratio *w* / *l* of the width *w* of the quadtree cell to the distance *l* from the node to the cell’s center of mass is less than *theta*, all nodes in the given cell are treated as a single node rather than individually.

<a name="manyBody_distanceMin" href="#manyBody_distanceMin">#</a> <i>manyBody</i>.<b>distanceMin</b>([<i>distance</i>])

If *distance* is specified, sets the minimum distance between nodes over which this force is considered. If *distance* is not specified, returns the current minimum distance, which defaults to 1. A minimum distance establishes an upper bound on the strength of the force between two nearby nodes, avoiding instability. In particular, it avoids an infinitely-strong force if two nodes are exactly coincident; in this case, the direction of the force is random.

<a name="manyBody_distanceMax" href="#manyBody_distanceMax">#</a> <i>manyBody</i>.<b>distanceMax</b>([<i>distance</i>])

If *distance* is specified, sets the maximum distance between nodes over which this force is considered. If *distance* is not specified, returns the current maximum distance, which defaults to infinity. Specifying a finite maximum distance improves performance and produces a more localized layout.

#### Positioning

The [*x*](#forceX)- and [*y*](#forceY)-positioning forces push nodes towards a desired position along the given dimension with a configurable strength. The strength of the force is proportional to the one-dimensional distance between the node’s position and the target position. While these forces can be used to position individual nodes, they are intended primarily for global forces that apply to all (or most) nodes.

<a name="forceX" href="#forceX">#</a> d3.<b>forceX</b>([<i>x</i>])

Creates a new positioning force along the *x*-axis towards the given position [*x*](#x_x). If *x* is not specified, it defaults to 0.

<a name="x_strength" href="#x_strength">#</a> <i>x</i>.<b>strength</b>([<i>strength</i>])

If *strength* is specified, sets the strength accessor to the specified number or function, re-evaluates the strength accessor for each node, and returns this force. The *strength* determines how much to increment the node’s *x*-velocity: ([*x*](#x_x) - *node*.x) × *strength*. For example, a value of 0.1 indicates that the node should move a tenth of the way from its current *x*-position to the target *x*-position with each application. Higher values moves nodes more quickly to the target position, often at the expense of other forces or constraints. A value outside the range [0,1] is not recommended.

If *strength* is not specified, returns the current strength accessor, which defaults to:

```js
function strength() {
  return 0.1;
}
```

The strength accessor is invoked for each [node](#simulation_nodes) in the simulation, being passed the *node* and its zero-based *index*. The resulting number is then stored internally, such that the strength of each node is only recomputed when the force is initialized or when this method is called, and not on every application of the force.

<a name="x_x" href="#x_x">#</a> <i>x</i>.<b>x</b>([<i>x</i>])

If *x* is specified, sets the *x*-coordinate accessor to the specified number or function, re-evaluates the *x*-accessor for each node, and returns this force. If *x* is not specified, returns the current *x*-accessor, which defaults to:

```js
function x() {
  return 0;
}
```

The *x*-accessor is invoked for each [node](#simulation_nodes) in the simulation, being passed the *node* and its zero-based *index*. The resulting number is then stored internally, such that the target *x*-coordinate of each node is only recomputed when the force is initialized or when this method is called, and not on every application of the force.

<a name="forceY" href="#forceY">#</a> d3.<b>forceY</b>([<i>y</i>])

Creates a new positioning force along the *y*-axis towards the given position [*y*](#y_y). If *y* is not specified, it defaults to 0.

<a name="y_strength" href="#y_strength">#</a> <i>y</i>.<b>strength</b>([<i>strength</i>])

If *strength* is specified, sets the strength accessor to the specified number or function, re-evaluates the strength accessor for each node, and returns this force. The *strength* determines how much to increment the node’s *y*-velocity: ([*y*](#y_y) - *node*.y) × *strength*. For example, a value of 0.1 indicates that the node should move a tenth of the way from its current *y*-position to the target *y*-position with each application. Higher values moves nodes more quickly to the target position, often at the expense of other forces or constraints. A value outside the range [0,1] is not recommended.

If *strength* is not specified, returns the current strength accessor, which defaults to:

```js
function strength() {
  return 0.1;
}
```

The strength accessor is invoked for each [node](#simulation_nodes) in the simulation, being passed the *node* and its zero-based *index*. The resulting number is then stored internally, such that the strength of each node is only recomputed when the force is initialized or when this method is called, and not on every application of the force.

<a name="y_y" href="#y_y">#</a> <i>y</i>.<b>y</b>([<i>y</i>])

If *y* is specified, sets the *y*-coordinate accessor to the specified number or function, re-evaluates the *y*-accessor for each node, and returns this force. If *y* is not specified, returns the current *y*-accessor, which defaults to:

```js
function y() {
  return 0;
}
```

The *y*-accessor is invoked for each [node](#simulation_nodes) in the simulation, being passed the *node* and its zero-based *index*. The resulting number is then stored internally, such that the target *y*-coordinate of each node is only recomputed when the force is initialized or when this method is called, and not on every application of the force.
