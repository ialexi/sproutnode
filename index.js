
// runtime.js put directly here:
// RUNTIME.JS START
/* @license
==========================================================================
SproutCore Costello -- Property Observing Library
Copyright ©2006-2009, Sprout Systems, Inc. and contributors.
Portions copyright ©2008-2009 Apple Inc. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a 
copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the 
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in 
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.

For more information about SproutCore, visit http://www.sproutcore.com

==========================================================================
@license */
var sys = require("sys");

var exports = exports || {};
var SC = SC || exports;
var SproutCore = SproutCore || SC;
var YES = true, NO = false;

var sc_require = sc_require || function() { };
var sc_resource = sc_resource || function sc_resource() {};

// set up console
SC.console = {
  message: function(type, what) {
  	sys.puts(type + ": " + sys.inspect(what));
  },

  log: function(what){
  	this.message("LOG", what);
  },

  info: function(what){
  	this.message("INFO", what);
  },

  error: function(what){
  	this.message("ERROR", what);
  },

  warn: function(what){
  	this.message("WARN", what);
  }
};

SC.root = GLOBAL;

SC.mixin = function() {
    var e = arguments[0] || {};
    var a = 1;
    var d = arguments.length;
    var b;
    if (d === 1) {
        e = this || {};
        a = 0
    }
    for (; a < d; a++) {
        if (! (b = arguments[a])) {
            continue
        }
        for (var c in b) {
            if (!b.hasOwnProperty(c)) {
                continue
            }
            var f = b[c];
            if (e === f) {
                continue
            }
            if (f !== undefined) {
                e[c] = f
            }
        }
    }
    return e
};
SC.supplement = function() {
    var e = arguments[0] || {};
    var a = 1;
    var d = arguments.length;
    var b;
    if (d === 1) {
        e = this || {};
        a = 0
    }
    for (; a < d; a++) {
        if (! (b = arguments[a])) {
            continue
        }
        for (var c in b) {
            if (!b.hasOwnProperty(c)) {
                continue
            }
            var f = e[c];
            var g = b[c];
            if (e === g) {
                continue
            }
            if (g !== undefined && f === undefined) {
                e[c] = g
            }
        }
    }
    return e
};
SC.extend = SC.mixin;
SC.mixin({
    T_ERROR: "error",
    T_OBJECT: "object",
    T_NULL: "null",
    T_CLASS: "class",
    T_HASH: "hash",
    T_FUNCTION: "function",
    T_UNDEFINED: "undefined",
    T_NUMBER: "number",
    T_BOOL: "boolean",
    T_ARRAY: "array",
    T_STRING: "string",
    typeOf: function(b) {
        if (b === undefined) {
            return SC.T_UNDEFINED
        }
        if (b === null) {
            return SC.T_NULL
        }
        var a = typeof(b);
        if (a == "object") {
            if (b instanceof Array) {
                a = SC.T_ARRAY
            } else {
                if (b instanceof Function) {
                    a = b.isClass ? SC.T_CLASS: SC.T_FUNCTION
                } else {
                    if (SC.Error && (b instanceof SC.Error)) {
                        a = SC.T_ERROR
                    } else {
                        if (b.isObject === true) {
                            a = SC.T_OBJECT
                        } else {
                            a = SC.T_HASH
                        }
                    }
                }
            }
        } else {
            if (a === SC.T_FUNCTION) {
                a = (b.isClass) ? SC.T_CLASS: SC.T_FUNCTION
            }
        }
        return a
    },
    none: function(a) {
        return a === null || a === undefined
    },
    empty: function(a) {
        return a === null || a === undefined || a === ""
    },
    isArray: function(c) {
        if (c && c.objectAt) {
            return YES
        }
        var a = (c ? c.length: null),
        b = SC.typeOf(c);
        return ! (SC.none(a) || (b === SC.T_FUNCTION) || (b === SC.T_STRING) || c.setInterval)
    },
    makeArray: function(a) {
        return SC.isArray(a) ? a: SC.A(a)
    },
    A: function(c) {
        if (SC.none(c)) {
            return []
        }
        if (c.slice instanceof Function) {
            if (typeof(c) === "string") {
                return [c]
            } else {
                return c.slice()
            }
        }
        if (c.toArray) {
            return c.toArray()
        }
        if (!SC.isArray(c)) {
            return [c]
        }
        var b = [],
        a = c.length;
        while (--a >= 0) {
            b[a] = c[a]
        }
        return b
    },
    guidKey: "_sc_guid_" + new Date().getTime(),
    _nextGUID: 0,
    _numberGuids: [],
    _stringGuids: {},
    _keyCache: {},
    guidFor: function(b) {
        if (b === undefined) {
            return "(undefined)"
        }
        if (b === null) {
            return "(null)"
        }
        if (b === Object) {
            return "(Object)"
        }
        if (b === Array) {
            return "(Array)"
        }
        var a = this.guidKey;
        if (b[a]) {
            return b[a]
        }
        switch (typeof b) {
        case SC.T_NUMBER:
            return (this._numberGuids[b] = this._numberGuids[b] || ("nu" + b));
        case SC.T_STRING:
            return (this._stringGuids[b] = this._stringGuids[b] || ("st" + b));
        case SC.T_BOOL:
            return (b) ? "(true)": "(false)";
        default:
            return SC.generateGuid(b)
        }
    },
    keyFor: function(d, c) {
        var b,
        a = this._keyCache[d];
        if (!a) {
            a = this._keyCache[d] = {}
        }
        b = a[c];
        if (!b) {
            b = a[c] = d + "_" + c
        }
        return b
    },
    generateGuid: function(b) {
        var a = ("sc" + (this._nextGUID++));
        if (b) {
            b[this.guidKey] = a
        }
        return a
    },
    hashFor: function(a) {
        return (a && a.hash && (typeof a.hash === SC.T_FUNCTION)) ? a.hash() : this.guidFor(a)
    },
    isEqual: function(d, c) {
        if (d === null) {
            return c === null
        } else {
            if (d === undefined) {
                return c === undefined
            } else {
                return this.hashFor(d) === this.hashFor(c)
            }
        }
    },
    compare: function(h, g) {
        var f = SC.typeOf(h);
        var d = SC.typeOf(g);
        var j = SC.ORDER_DEFINITION.indexOf(f);
        var b = SC.ORDER_DEFINITION.indexOf(d);
        if (j < b) {
            return - 1
        }
        if (j > b) {
            return 1
        }
        switch (f) {
        case SC.T_BOOL:
        case SC.T_NUMBER:
            if (h < g) {
                return - 1
            }
            if (h > g) {
                return 1
            }
            return 0;
        case SC.T_STRING:
            if (h.localeCompare(g) < 0) {
                return - 1
            }
            if (h.localeCompare(g) > 0) {
                return 1
            }
            return 0;
        case SC.T_ARRAY:
            var c = Math.min(h.length, g.length);
            var a = 0;
            var e = 0;
            while (a === 0 && e < c) {
                a = arguments.callee(h[e], g[e]);
                if (a !== 0) {
                    return a
                }
                e++
            }
            if (h.length < g.length) {
                return - 1
            }
            if (h.length > g.length) {
                return 1
            }
            return 0;
        case SC.T_OBJECT:
            if (h.constructor.isComparable === YES) {
                return h.constructor.compare(h, g)
            }
            return 0;
        default:
            return 0
        }
    },
    K: function() {
        return this
    },
    EMPTY_ARRAY: [],
    EMPTY_HASH: {},
    EMPTY_RANGE: {
        start: 0,
        length: 0
    },
    beget: function(c) {
        if (SC.none(c)) {
            return null
        }
        var a = SC.K;
        a.prototype = c;
        var b = new a();
        a.prototype = null;
        if (SC.typeOf(c.didBeget) === SC.T_FUNCTION) {
            b = c.didBeget(b)
        }
        return b
    },
    copy: function(b) {
        var a = b;
        if (b && b.isCopyable) {
            return b.copy()
        }
        switch (SC.typeOf(b)) {
        case SC.T_ARRAY:
            if (b.clone && SC.typeOf(b.clone) === SC.T_FUNCTION) {
                a = b.clone()
            } else {
                a = b.slice()
            }
            break;
        case SC.T_HASH:
        case SC.T_OBJECT:
            if (b.clone && SC.typeOf(b.clone) === SC.T_FUNCTION) {
                a = b.clone()
            } else {
                a = {};
                for (var c in b) {
                    a[c] = b[c]
                }
            }
        }
        return a
    },
    merge: function() {
        var c = {},
        b = arguments.length,
        a;
        for (a = 0; a < b; a++) {
            SC.mixin(c, arguments[a])
        }
        return c
    },
    keys: function(c) {
        var a = [];
        for (var b in c) {
            a.push(b)
        }
        return a
    },
    inspect: function(d) {
        var a,
        b = [];
        for (var c in d) {
            a = d[c];
            if (a === "toString") {
                continue
            }
            if (SC.typeOf(a) === SC.T_FUNCTION) {
                a = "function() { ... }"
            }
            b.push(c + ": " + a)
        }
        return "{" + b.join(" , ") + "}"
    },
    tupleForPropertyPath: function(e, a) {
        if (SC.typeOf(e) === SC.T_ARRAY) {
            return e
        }
        var c;
        var b = e.indexOf("*");
        if (b < 0) {
            b = e.lastIndexOf(".")
        }
        c = (b >= 0) ? e.slice(b + 1) : e;
        var d = this.objectForPropertyPath(e, a, b);
        return (d && c) ? [d, c] : null
    },
    objectForPropertyPath: function(f, c, d) {
        var g,
        b,
        e,
        a;
        if (!c) {
            c = SC.root
        }
        if (SC.typeOf(f) === SC.T_STRING) {
            if (d === undefined) {
                d = f.length
            }
            g = 0;
            while ((c) && (g < d)) {
                b = f.indexOf(".", g);
                if ((b < 0) || (b > d)) {
                    b = d
                }
                e = f.slice(g, b);
                c = c.get ? c.get(e) : c[e];
                g = b + 1
            }
            if (g < d) {
                c = undefined
            }
        } else {
            g = 0;
            a = f.length;
            e = null;
            while ((g < a) && c) {
                e = f[g++];
                if (e) {
                    c = (c.get) ? c.get(e) : c[e]
                }
            }
            if (g < a) {
                c = undefined
            }
        }
        return c
    },
    STRINGS: {},
    stringsFor: function(b, a) {
        SC.mixin(SC.STRINGS, a);
        return this
    }
});
SC.clone = SC.copy;
SC.$A = SC.A;
SC.didLoad = SC.K;
SC.ORDER_DEFINITION = [SC.T_ERROR, SC.T_UNDEFINED, SC.T_NULL, SC.T_BOOL, SC.T_NUMBER, SC.T_STRING, SC.T_ARRAY, SC.T_HASH, SC.T_OBJECT, SC.T_FUNCTION, SC.T_CLASS];
SC.mixin(Function.prototype, {
    property: function() {
        this.dependentKeys = SC.$A(arguments);
        var a = SC.guidFor(this);
        this.cacheKey = "__cache__" + a;
        this.lastSetValueKey = "__lastValue__" + a;
        this.isProperty = YES;
        return this
    },
    cacheable: function(a) {
        this.isProperty = YES;
        if (!this.dependentKeys) {
            this.dependentKeys = []
        }
        this.isCacheable = (a === undefined) ? YES: a;
        return this
    },
    idempotent: function(a) {
        this.isProperty = YES;
        if (!this.dependentKeys) {
            this.dependentKeys = []
        }
        this.isVolatile = (a === undefined) ? YES: a;
        return this
    },
    observes: function(a) {
        var e = arguments.length,
        b = null,
        d = null;
        while (--e >= 0) {
            var c = arguments[e];
            if ((c.indexOf(".") < 0) && (c.indexOf("*") < 0)) {
                if (!b) {
                    b = this.localPropertyPaths = []
                }
                b.push(c)
            } else {
                if (!d) {
                    d = this.propertyPaths = []
                }
                d.push(c)
            }
        }
        return this
    }
});
String.prototype.fmt = function() {
    var b = arguments;
    var a = 0;
    return this.replace(/%@([0-9]+)?/g,
    function(c, d) {
        d = (d) ? parseInt(d, 0) - 1: a++;
        c = b[d];
        return ((c === null) ? "(null)": (c === undefined) ? "": c).toString()
    })
};
String.prototype.loc = function() {
    var a = SC.STRINGS[this] || this;
    return a.fmt.apply(a, arguments)
};
String.prototype.w = function() {
    var c = [],
    d = this.split(" "),
    b = d.length;
    for (var a = 0; a < b; ++a) {
        var e = d[a];
        if (e.length !== 0) {
            c.push(e)
        }
    }
    return c
};
SC.ObserverSet = {
    targets: 0,
    _membersCacheIsValid: NO,
    add: function(d, f, b) {
        var c = (d) ? SC.guidFor(d) : "__this__";
        var a = this[c];
        if (!a) {
            a = this[c] = SC.CoreSet.create();
            a.target = d;
            a.isTargetSet = YES;
            this.targets++
        }
        a.add(f);
        if (b !== undefined) {
            var e = a.contexts;
            if (!b) {
                e = {}
            }
            e[SC.guidFor(f)] = b
        }
        this._membersCacheIsValid = NO
    },
    remove: function(c, d) {
        var b = (c) ? SC.guidFor(c) : "__this__";
        var a = this[b];
        if (!a) {
            return NO
        }
        a.remove(d);
        if (a.length <= 0) {
            a.target = null;
            a.isTargetSet = NO;
            a.contexts = null;
            delete this[b];
            this.targets--
        } else {
            if (a.contexts) {
                delete a.contexts[SC.guidFor(d)]
            }
        }
        this._membersCacheIsValid = NO;
        return YES
    },
    invokeMethods: function() {
        for (var b in this) {
            if (!this.hasOwnProperty(b)) {
                continue
            }
            var c = this[b];
            if (c && c.isTargetSet) {
                var a = c.length;
                var d = c.target;
                while (--a >= 0) {
                    c[a].call(d)
                }
            }
        }
    },
    getMembers: function() {
        if (this._membersCacheIsValid) {
            return this._members
        }
        if (!this._members) {
            this._members = []
        } else {
            this._members.length = 0
        }
        var b = this._members;
        for (var c in this) {
            if (!this.hasOwnProperty(c)) {
                continue
            }
            var d = this[c];
            if (d && d.isTargetSet) {
                var a = d.length;
                var e = d.target;
                var g = d.contexts;
                if (g) {
                    while (--a >= 0) {
                        var f = d[a];
                        b.push([e, f, g[SC.guidFor(f)]])
                    }
                } else {
                    while (--a >= 0) {
                        b.push([e, d[a]])
                    }
                }
            }
        }
        this._membersCacheIsValid = YES;
        return b
    },
    clone: function() {
        var b,
        d,
        c,
        a = SC.ObserverSet.create();
        for (c in this) {
            if (!this.hasOwnProperty(c)) {
                continue
            }
            b = this[c];
            if (b && b.isTargetSet) {
                d = b.clone();
                d.target = b.target;
                if (b.contexts) {
                    d.contexts = SC.clone(b.contexts)
                }
                a[c] = d
            }
        }
        a.targets = this.targets;
        a._membersCacheIsValid = NO;
        return a
    },
    create: function() {
        return SC.beget(this)
    }
};
SC.ObserverSet.slice = SC.ObserverSet.clone;
sc_require("private/observer_set");
SC.LOG_OBSERVERS = NO;
SC.Observable = {
    isObservable: YES,
    automaticallyNotifiesObserversFor: function(a) {
        return YES
    },
    get: function(c) {
        var b = this[c],
        a;
        if (b === undefined) {
            return this.unknownProperty(c)
        } else {
            if (b && b.isProperty) {
                if (b.isCacheable) {
                    a = this._kvo_cache;
                    if (!a) {
                        a = this._kvo_cache = {}
                    }
                    return (a[b.cacheKey] !== undefined) ? a[b.cacheKey] : (a[b.cacheKey] = b.call(this, c))
                } else {
                    return b.call(this, c)
                }
            } else {
                return b
            }
        }
    },
    set: function(h, f) {
        var b = this[h],
        i = this.automaticallyNotifiesObserversFor(h),
        e = f,
        c,
        a,
        g,
        d;
        if (this._kvo_cacheable && (a = this._kvo_cache)) {
            c = this._kvo_cachedep;
            if (!c || (c = c[h]) === undefined) {
                c = this._kvo_computeCachedDependentsFor(h)
            }
            if (c) {
                g = c.length;
                while (--g >= 0) {
                    d = c[g];
                    a[d.cacheKey] = a[d.lastSetValueKey] = undefined
                }
            }
        }
        if (b && b.isProperty) {
            a = this._kvo_cache;
            if (b.isVolatile || !a || (a[b.lastSetValueKey] !== f)) {
                if (!a) {
                    a = this._kvo_cache = {}
                }
                a[b.lastSetValueKey] = f;
                if (i) {
                    this.propertyWillChange(h)
                }
                e = b.call(this, h, f);
                if (b.isCacheable) {
                    a[b.cacheKey] = e
                }
                if (i) {
                    this.propertyDidChange(h, e, YES)
                }
            }
        } else {
            if (b === undefined) {
                if (i) {
                    this.propertyWillChange(h)
                }
                this.unknownProperty(h, f);
                if (i) {
                    this.propertyDidChange(h, e)
                }
            } else {
                if (this[h] !== f) {
                    if (i) {
                        this.propertyWillChange(h)
                    }
                    e = this[h] = f;
                    if (i) {
                        this.propertyDidChange(h, e)
                    }
                }
            }
        }
        return this
    },
    unknownProperty: function(a, b) {
        if (! (b === undefined)) {
            this[a] = b
        }
        return b
    },
    beginPropertyChanges: function() {
        this._kvo_changeLevel = (this._kvo_changeLevel || 0) + 1;
        return this
    },
    endPropertyChanges: function() {
        this._kvo_changeLevel = (this._kvo_changeLevel || 1) - 1;
        var b = this._kvo_changeLevel,
        a = this._kvo_changes;
        if ((b <= 0) && a && (a.length > 0) && !SC.Observers.isObservingSuspended) {
            this._notifyPropertyObservers()
        }
        return this
    },
    propertyWillChange: function(a) {
        return this
    },
    propertyDidChange: function(l, j, c) {
        this._kvo_revision = (this._kvo_revision || 0) + 1;
        var b = this._kvo_changeLevel || 0,
        g,
        k,
        h,
        a,
        d,
        f = SC.LOG_OBSERVERS && !(this.LOG_OBSERVING === NO);
        if (this._kvo_cacheable && (a = this._kvo_cache)) {
            if (!c) {
                d = this[l];
                if (d && d.isProperty) {
                    a[d.cacheKey] = a[d.lastSetValueKey] = undefined
                }
            }
            g = this._kvo_cachedep;
            if (!g || (g = g[l]) === undefined) {
                g = this._kvo_computeCachedDependentsFor(l)
            }
            if (g) {
                k = g.length;
                while (--k >= 0) {
                    h = g[k];
                    a[h.cacheKey] = a[h.lastSetValueKey] = undefined
                }
            }
        }
        var e = SC.Observers.isObservingSuspended;
        if ((b > 0) || e) {
            var i = this._kvo_changes;
            if (!i) {
                i = this._kvo_changes = SC.CoreSet.create()
            }
            i.add(l);
            if (e) {
                if (f) {
                    console.log("%@%@: will not notify observers because observing is suspended".fmt(SC.KVO_SPACES, this))
                }
                SC.Observers.objectHasPendingChanges(this)
            }
        } else {
            this._notifyPropertyObservers(l)
        }
        return this
    },
    registerDependentKey: function(h, c) {
        var e = this._kvo_dependents,
        b = this[h],
        i,
        g,
        a,
        f,
        d;
        if (SC.typeOf(c) === SC.T_ARRAY) {
            i = c;
            a = 0
        } else {
            i = arguments;
            a = 1
        }
        g = i.length;
        if (!e) {
            this._kvo_dependents = e = {}
        }
        while (--g >= a) {
            f = i[g];
            d = e[f];
            if (!d) {
                d = e[f] = []
            }
            d.push(h)
        }
    },
    _kvo_addCachedDependents: function(b, f, h, c) {
        var a = f.length,
        e,
        d,
        g;
        while (--a >= 0) {
            d = f[a];
            c.add(d);
            e = this[d];
            if (e && (e instanceof Function) && e.isProperty) {
                if (e.isCacheable) {
                    b.push(e)
                }
                if ((g = h[d]) && g.length > 0) {
                    this._kvo_addCachedDependents(b, g, h, c)
                }
            }
        }
    },
    _kvo_computeCachedDependentsFor: function(c) {
        var d = this._kvo_cachedep,
        f = this._kvo_dependents,
        e = f ? f[c] : null,
        a,
        b;
        if (!d) {
            d = this._kvo_cachedep = {}
        }
        if (!e || e.length === 0) {
            return d[c] = null
        }
        a = d[c] = [];
        b = SC._TMP_SEEN_SET = (SC._TMP_SEEN_SET || SC.CoreSet.create());
        b.add(c);
        this._kvo_addCachedDependents(a, e, f, b);
        b.clear();
        if (a.length === 0) {
            a = d[c] = null
        }
        return a
    },
    _kvo_for: function(c, b) {
        var a = this[c];
        if (!this._kvo_cloned) {
            this._kvo_cloned = {}
        }
        if (!a) {
            a = this[c] = (b === undefined) ? [] : b.create();
            this._kvo_cloned[c] = YES
        } else {
            if (!this._kvo_cloned[c]) {
                a = this[c] = a.copy();
                this._kvo_cloned[c] = YES
            }
        }
        return a
    },
    addObserver: function(c, f, h, b) {
        var d,
        a,
        e,
        g;
        if (h === undefined) {
            h = f;
            f = this
        }
        if (!f) {
            f = this
        }
        if (SC.typeOf(h) === SC.T_STRING) {
            h = f[h]
        }
        if (!h) {
            throw "You must pass a method to addObserver()"
        }
        c = c.toString();
        if (c.indexOf(".") >= 0) {
            a = SC._ChainObserver.createChain(this, c, f, h, b);
            a.masterTarget = f;
            a.masterMethod = h;
            this._kvo_for(SC.keyFor("_kvo_chains", c)).push(a)
        } else {
            if ((this[c] === undefined) && (c.indexOf("@") === 0)) {
                this.get(c)
            }
            if (f === this) {
                f = null
            }
            d = SC.keyFor("_kvo_observers", c);
            this._kvo_for(d, SC.ObserverSet).add(f, h, b);
            this._kvo_for("_kvo_observed_keys", SC.CoreSet).add(c)
        }
        if (this.didAddObserver) {
            this.didAddObserver(c, f, h)
        }
        return this
    },
    removeObserver: function(c, f, h) {
        var d,
        e,
        b,
        g,
        a;
        if (h === undefined) {
            h = f;
            f = this
        }
        if (!f) {
            f = this
        }
        if (SC.typeOf(h) === SC.T_STRING) {
            h = f[h]
        }
        if (!h) {
            throw "You must pass a method to addObserver()"
        }
        c = c.toString();
        if (c.indexOf(".") >= 0) {
            d = SC.keyFor("_kvo_chains", c);
            if (e = this[d]) {
                e = this._kvo_for(d);
                a = e.length;
                while (--a >= 0) {
                    b = e[a];
                    if (b && (b.masterTarget === f) && (b.masterMethod === h)) {
                        e[a] = b.destroyChain()
                    }
                }
            }
        } else {
            if (f === this) {
                f = null
            }
            d = SC.keyFor("_kvo_observers", c);
            if (g = this[d]) {
                g = this._kvo_for(d);
                g.remove(f, h);
                if (g.targets <= 0) {
                    this._kvo_for("_kvo_observed_keys", SC.CoreSet).remove(c)
                }
            }
        }
        if (this.didRemoveObserver) {
            this.didRemoveObserver(c, f, h)
        }
        return this
    },
    hasObserverFor: function(b) {
        SC.Observers.flush(this);
        var d = this[SC.keyFor("_kvo_observers", b)],
        c = this[SC.keyFor("_kvo_local", b)],
        a;
        if (c && c.length > 0) {
            return YES
        }
        if (d && d.getMembers().length > 0) {
            return YES
        }
        return NO
    },
    initObservable: function() {
        if (this._observableInited) {
            return
        }
        this._observableInited = YES;
        var e,
        l,
        j,
        i,
        g,
        d,
        k;
        if (l = this._observers) {
            var f = l.length;
            for (e = 0; e < f; e++) {
                j = l[e];
                g = this[j];
                d = g.propertyPaths;
                k = (d) ? d.length: 0;
                for (var b = 0;
                b < k; b++) {
                    var m = d[b];
                    var a = m.indexOf(".");
                    if (a < 0) {
                        this.addObserver(m, this, g)
                    } else {
                        if (m.indexOf("*") === 0) {
                            this.addObserver(m.slice(1), this, g)
                        } else {
                            var h = null;
                            if (a === 0) {
                                h = this;
                                m = m.slice(1)
                            } else {
                                if (a === 4 && m.slice(0, 5) === "this.") {
                                    h = this;
                                    m = m.slice(5)
                                } else {
                                    if (a < 0 && m.length === 4 && m === "this") {
                                        h = this;
                                        m = ""
                                    }
                                }
                            }
                            SC.Observers.addObserver(m, this, g, h)
                        }
                    }
                }
            }
        }
        this.bindings = [];
        if (l = this._bindings) {
            for (e = 0; e < l.length; e++) {
                j = l[e];
                i = this[j];
                var c = j.slice(0, -7);
                this[j] = this.bind(c, i)
            }
        }
        if (l = this._properties) {
            for (e = 0; e < l.length;
            e++) {
                j = l[e];
                if (i = this[j]) {
                    if (i.isCacheable) {
                        this._kvo_cacheable = YES
                    }
                    if (i.dependentKeys && (i.dependentKeys.length > 0)) {
                        this.registerDependentKey(j, i.dependentKeys)
                    }
                }
            }
        }
    },
    observersForKey: function(a) {
        var b = this._kvo_for("_kvo_observers", a);
        return b.getMembers() || []
    },
    _notifyPropertyObservers: function(t) {
        if (!this._observableInited) {
            this.initObservable()
        }
        SC.Observers.flush(this);
        var g = SC.LOG_OBSERVERS && !(this.LOG_OBSERVING === NO);
        var o,
        r,
        m,
        d,
        n,
        l,
        q;
        var p,
        j,
        a,
        f,
        s,
        c,
        i,
        e;
        var b,
        h,
        k;
        if (g) {
            h = SC.KVO_SPACES = (SC.KVO_SPACES || "") + "  ";
            console.log('%@%@: notifying observers after change to key "%@"'.fmt(h, this, t))
        }
        d = this["_kvo_observers_*"];
        this._kvo_changeLevel = (this._kvo_changeLevel || 0) + 1;
        while (((r = this._kvo_changes) && (r.length > 0)) || t) {
            q = ++this.propertyRevision;
            if (!r) {
                r = SC.CoreSet.create()
            }
            this._kvo_changes = null;
            if (t === "*") {
                r.add("*");
                r.addEach(this._kvo_for("_kvo_observed_keys", SC.CoreSet))
            } else {
                if (t) {
                    r.add(t)
                }
            }
            if (m = this._kvo_dependents) {
                for (n = 0; n < r.length; n++) {
                    t = r[n];
                    l = m[t];
                    if (l && (i = l.length)) {
                        if (g) {
                            console.log("%@...including dependent keys for %@: %@".fmt(h, t, l))
                        }
                        k = this._kvo_cache;
                        if (!k) {
                            k = this._kvo_cache = {}
                        }
                        while (--i >= 0) {
                            r.add(t = l[i]);
                            if (e = this[t]) {
                                this[e.cacheKey] = undefined;
                                k[e.cacheKey] = k[e.lastSetValueKey] = undefined
                            }
                        }
                    }
                }
            }
            while (r.length > 0) {
                t = r.pop();
                o = this[SC.keyFor("_kvo_observers", t)];
                if (o) {
                    p = o.getMembers();
                    j = p.length;
                    for (f = 0; f < j; f++) {
                        a = p[f];
                        if (a[3] === q) {
                            continue
                        }
                        s = a[0] || this;
                        c = a[1];
                        b = a[2];
                        a[3] = q;
                        if (g) {
                            console.log('%@...firing observer on %@ for key "%@"'.fmt(h, s, t))
                        }
                        if (b !== undefined) {
                            c.call(s, this, t, null, b, q)
                        } else {
                            c.call(s, this, t, null, q)
                        }
                    }
                }
                p = this[SC.keyFor("_kvo_local", t)];
                if (p) {
                    j = p.length;
                    for (f = 0; f < j; f++) {
                        a = p[f];
                        c = this[a];
                        if (c) {
                            if (g) {
                                console.log('%@...firing local observer %@.%@ for key "%@"'.fmt(h, this, a, t))
                            }
                            c.call(this, this, t, null, q)
                        }
                    }
                }
                if (d && t !== "*") {
                    p = d.getMembers();
                    j = p.length;
                    for (f = 0;
                    f < j; f++) {
                        a = p[f];
                        s = a[0] || this;
                        c = a[1];
                        b = a[2];
                        if (g) {
                            console.log('%@...firing * observer on %@ for key "%@"'.fmt(h, s, t))
                        }
                        if (b !== undefined) {
                            c.call(s, this, t, null, b, q)
                        } else {
                            c.call(s, this, t, null, q)
                        }
                    }
                }
                if (this.propertyObserver) {
                    if (g) {
                        console.log('%@...firing %@.propertyObserver for key "%@"'.fmt(h, this, t))
                    }
                    this.propertyObserver(this, t, null, q)
                }
            }
            if (r) {
                r.destroy()
            }
            t = null
        }
        this._kvo_changeLevel = (this._kvo_changeLevel || 1) - 1;
        if (g) {
            SC.KVO_SPACES = h.slice(0, -2)
        }
        return YES
    },
    bind: function(a, c, e) {
        var d;
        if (e !== undefined) {
            c = [c, e]
        }
        var b = SC.typeOf(c);
        if (b === SC.T_STRING || b === SC.T_ARRAY) {
            d = this[a + "BindingDefault"] || SC.Binding;
            d = d.beget().from(c)
        } else {
            d = c
        }
        d = d.to(a, this).connect();
        this.bindings.push(d);
        return d
    },
    didChangeFor: function(a) {
        a = SC.hashFor(a);
        var b = this._kvo_didChange_valueCache;
        if (!b) {
            b = this._kvo_didChange_valueCache = {}
        }
        var f = this._kvo_didChange_revisionCache;
        if (!f) {
            f = this._kvo_didChange_revisionCache = {}
        }
        var e = b[a] || {};
        var j = f[a] || {};
        var d = false;
        var c = this._kvo_revision || 0;
        var h = arguments.length;
        while (--h >= 1) {
            var i = arguments[h];
            if (j[i] != c) {
                var g = this.get(i);
                if (e[i] !== g) {
                    d = true;
                    e[i] = g
                }
            }
            j[i] = c
        }
        b[a] = e;
        f[a] = j;
        return d
    },
    setIfChanged: function(a, b) {
        return (this.get(a) !== b) ? this.set(a, b) : this
    },
    getPath: function(b) {
        var a = SC.tupleForPropertyPath(b, this);
        if (a === null || a[0] === null) {
            return undefined
        }
        return a[0].get(a[1])
    },
    setPath: function(c, b) {
        if (c.indexOf(".") >= 0) {
            var a = SC.tupleForPropertyPath(c, this);
            if (!a || !a[0]) {
                return null
            }
            a[0].set(a[1], b)
        } else {
            this.set(c, b)
        }
        return this
    },
    setPathIfChanged: function(c, b) {
        if (c.indexOf(".") >= 0) {
            var a = SC.tupleForPropertyPath(c, this);
            if (!a || !a[0]) {
                return null
            }
            if (a[0].get(a[1]) !== b) {
                a[0].set(a[1], b)
            }
        } else {
            this.setIfChanged(c, b)
        }
        return this
    },
    getEach: function() {
        var c = SC.A(arguments);
        var b = [];
        for (var a = 0; a < c.length;
        a++) {
            b[b.length] = this.getPath(c[a])
        }
        return b
    },
    incrementProperty: function(a) {
        this.set(a, (this.get(a) || 0) + 1);
        return this.get(a)
    },
    decrementProperty: function(a) {
        this.set(a, (this.get(a) || 0) - 1);
        return this.get(a)
    },
    toggleProperty: function(a, b, c) {
        if (b === undefined) {
            b = true
        }
        if (c === undefined) {
            c = false
        }
        b = (this.get(a) == b) ? c: b;
        this.set(a, b);
        return this.get(a)
    },
    notifyPropertyChange: function(a, b) {
        this.propertyWillChange(a);
        this.propertyDidChange(a, b);
        return this
    },
    allPropertiesDidChange: function() {
        this._kvo_cache = null;
        this._notifyPropertyObservers("*");
        return this
    },
    addProbe: function(a) {
        this.addObserver(a, SC.logChange)
    },
    removeProbe: function(a) {
        this.removeObserver(a, SC.logChange)
    },
    logProperty: function() {
        var b = SC.$A(arguments);
        for (var a = 0; a < b.length; a++) {
            var c = b[a];
            console.log("%@:%@: ".fmt(SC.guidFor(this), c), this.get(c))
        }
    },
    propertyRevision: 1
};
SC.logChange = function logChange(c, a, b) {
    console.log("CHANGE: %@[%@] => %@".fmt(c, a, c.get(a)))
};
SC.mixin(Array.prototype, SC.Observable);
SC.Enumerator = function(a) {
    this.enumerable = a;
    this.reset();
    return this
};
SC.Enumerator.prototype = {
    nextObject: function() {
        var c = this._index;
        var a = this._length;
        if (c >= a) {
            return undefined
        }
        var b = this.enumerable.nextObject(c, this._previousObject, this._context);
        this._previousObject = b;
        this._index = c + 1;
        if (c >= a) {
            this._context = SC.Enumerator._pushContext(this._context)
        }
        return b
    },
    reset: function() {
        var b = this.enumerable;
        if (!b) {
            throw SC.$error("Enumerator has been destroyed")
        }
        this._length = b.get ? b.get("length") : b.length;
        var a = this._length;
        this._index = 0;
        this._previousObject = null;
        this._context = (a > 0) ? SC.Enumerator._popContext() : null
    },
    destroy: function() {
        this.enumerable = this._length = this._index = this._previousObject = this._context = null
    }
};
SC.Enumerator.create = function(a) {
    return new SC.Enumerator(a)
};
SC.Enumerator._popContext = function() {
    var a = this._contextCache ? this._contextCache.pop() : null;
    return a || {}
};
SC.Enumerator._pushContext = function(b) {
    this._contextCache = this._contextCache || [];
    var a = this._contextCache;
    a.push(b);
    return null
};
sc_require("core");
sc_require("system/enumerator");
SC.Enumerable = {
    isEnumerable: YES,
    nextObject: function(a, c, b) {
        return this.objectAt ? this.objectAt(a) : this[a]
    },
    firstObject: function() {
        if (this.get("length") === 0) {
            return undefined
        }
        if (this.objectAt) {
            return this.objectAt(0)
        }
        var b = SC.Enumerator._popContext(),
        a;
        a = this.nextObject(0, null, b);
        b = SC.Enumerator._pushContext(b);
        return a
    }.property(),
    enumerator: function() {
        return SC.Enumerator.create(this)
    },
    forEach: function(g, f) {
        if (typeof g !== "function") {
            throw new TypeError()
        }
        var b = this.get ? this.get("length") : this.length;
        if (f === undefined) {
            f = null
        }
        var e = null;
        var c = SC.Enumerator._popContext();
        for (var a = 0; a < b; a++) {
            var d = this.nextObject(a, e, c);
            g.call(f, d, a, this);
            e = d
        }
        e = null;
        c = SC.Enumerator._pushContext(c);
        return this
    },
    getEach: function(a) {
        return this.map(function(b) {
            return b ? (b.get ? b.get(a) : b[a]) : null
        },
        this)
    },
    setEach: function(a, b) {
        this.forEach(function(c) {
            if (c) {
                if (c.set) {
                    c.set(a, b)
                } else {
                    c[a] = b
                }
            }
        },
        this);
        return this
    },
    map: function(h, g) {
        if (typeof h !== "function") {
            throw new TypeError()
        }
        var b = this.get ? this.get("length") : this.length;
        if (g === undefined) {
            g = null
        }
        var c = [];
        var f = null;
        var d = SC.Enumerator._popContext();
        for (var a = 0; a < b; a++) {
            var e = this.nextObject(a, f, d);
            c[a] = h.call(g, e, a, this);
            f = e
        }
        f = null;
        d = SC.Enumerator._pushContext(d);
        return c
    },
    mapProperty: function(a) {
        return this.map(function(b) {
            return b ? (b.get ? b.get(a) : b[a]) : null
        })
    },
    filter: function(h, g) {
        if (typeof h !== "function") {
            throw new TypeError()
        }
        var b = this.get ? this.get("length") : this.length;
        if (g === undefined) {
            g = null
        }
        var c = [];
        var f = null;
        var d = SC.Enumerator._popContext();
        for (var a = 0;
        a < b; a++) {
            var e = this.nextObject(a, f, d);
            if (h.call(g, e, a, this)) {
                c.push(e)
            }
            f = e
        }
        f = null;
        d = SC.Enumerator._pushContext(d);
        return c
    },
    sortProperty: function(b) {
        var c = (typeof b === SC.T_STRING) ? arguments: b,
        a = c.length,
        d;
        if (this instanceof Array) {
            d = this
        } else {
            d = [];
            this.forEach(function(e) {
                d.push(e)
            })
        }
        if (!d) {
            return []
        }
        return d.sort(function(g, f) {
            var e,
            i,
            k,
            j,
            h = 0;
            for (e = 0; h === 0 && e < a; e++) {
                i = c[e];
                k = g ? (g.get ? g.get(i) : g[i]) : null;
                j = f ? (f.get ? f.get(i) : f[i]) : null;
                h = SC.compare(k, j)
            }
            return h
        })
    },
    filterProperty: function(j, f) {
        var d = this.get ? this.get("length") : this.length;
        var e = [];
        var i = null;
        var b = SC.Enumerator._popContext();
        for (var g = 0; g < d; g++) {
            var c = this.nextObject(g, i, b);
            var h = c ? (c.get ? c.get(j) : c[j]) : null;
            var a = (f === undefined) ? !!h: SC.isEqual(h, f);
            if (a) {
                e.push(c)
            }
            i = c
        }
        i = null;
        b = SC.Enumerator._pushContext(b);
        return e
    },
    find: function(h, d) {
        if (typeof h !== "function") {
            throw new TypeError()
        }
        var c = this.get ? this.get("length") : this.length;
        if (d === undefined) {
            d = null
        }
        var g = null,
        b,
        i = NO,
        e = null;
        var a = SC.Enumerator._popContext();
        for (var f = 0; f < c && !i; f++) {
            b = this.nextObject(f, g, a);
            if (i = h.call(d, b, f, this)) {
                e = b
            }
            g = b
        }
        b = g = null;
        a = SC.Enumerator._pushContext(a);
        return e
    },
    findProperty: function(i, f) {
        var c = this.get ? this.get("length") : this.length;
        var j = NO,
        d = null,
        h = null,
        b,
        g;
        var a = SC.Enumerator._popContext();
        for (var e = 0; e < c && !j; e++) {
            b = this.nextObject(e, h, a);
            g = b ? (b.get ? b.get(i) : b[i]) : null;
            j = (f === undefined) ? !!g: SC.isEqual(g, f);
            if (j) {
                d = b
            }
            h = b
        }
        h = b = null;
        a = SC.Enumerator._pushContext(a);
        return d
    },
    every: function(h, g) {
        if (typeof h !== "function") {
            throw new TypeError()
        }
        var b = this.get ? this.get("length") : this.length;
        if (g === undefined) {
            g = null
        }
        var c = YES;
        var f = null;
        var d = SC.Enumerator._popContext();
        for (var a = 0; c && (a < b); a++) {
            var e = this.nextObject(a, f, d);
            if (!h.call(g, e, a, this)) {
                c = NO
            }
            f = e
        }
        f = null;
        d = SC.Enumerator._pushContext(d);
        return c
    },
    everyProperty: function(i, e) {
        var c = this.get ? this.get("length") : this.length;
        var d = YES;
        var h = null;
        var a = SC.Enumerator._popContext();
        for (var f = 0; d && (f < c); f++) {
            var b = this.nextObject(f, h, a);
            var g = b ? (b.get ? b.get(i) : b[i]) : null;
            d = (e === undefined) ? !!g: SC.isEqual(g, e);
            h = b
        }
        h = null;
        a = SC.Enumerator._pushContext(a);
        return d
    },
    some: function(h, g) {
        if (typeof h !== "function") {
            throw new TypeError()
        }
        var b = this.get ? this.get("length") : this.length;
        if (g === undefined) {
            g = null
        }
        var c = NO;
        var f = null;
        var d = SC.Enumerator._popContext();
        for (var a = 0; (!c) && (a < b); a++) {
            var e = this.nextObject(a, f, d);
            if (h.call(g, e, a, this)) {
                c = YES
            }
            f = e
        }
        f = null;
        d = SC.Enumerator._pushContext(d);
        return c
    },
    someProperty: function(i, e) {
        var c = this.get ? this.get("length") : this.length;
        var d = NO;
        var h = null;
        var a = SC.Enumerator._popContext();
        for (var f = 0; ! d && (f < c); f++) {
            var b = this.nextObject(f, h, a);
            var g = b ? (b.get ? b.get(i) : b[i]) : null;
            d = (e === undefined) ? !!g: SC.isEqual(g, e);
            h = b
        }
        h = null;
        a = SC.Enumerator._pushContext(a);
        return d
    },
    reduce: function(g, h, i) {
        if (typeof g !== "function") {
            throw new TypeError()
        }
        var c = this.get ? this.get("length") : this.length;
        if (c === 0 && h === undefined) {
            throw new TypeError()
        }
        var d = h;
        var f = null;
        var a = SC.Enumerator._popContext();
        for (var e = 0; e < c; e++) {
            var b = this.nextObject(e, f, a);
            if (b !== null) {
                if (d === undefined) {
                    d = b
                } else {
                    d = g.call(null, d, b, e, this, i)
                }
            }
            f = b
        }
        f = null;
        a = SC.Enumerator._pushContext(a);
        if (d === undefined) {
            throw new TypeError()
        }
        return d
    },
    invoke: function(h) {
        var e = this.get ? this.get("length") : this.length;
        if (e <= 0) {
            return []
        }
        var i;
        var g = [];
        var c = arguments.length;
        if (c > 1) {
            for (i = 1; i < c; i++) {
                g.push(arguments[i])
            }
        }
        var f = [];
        var j = null;
        var b = SC.Enumerator._popContext();
        for (i = 0; i < e; i++) {
            var d = this.nextObject(i, j, b);
            var a = d ? d[h] : null;
            if (a) {
                f[i] = a.apply(d, g)
            }
            j = d
        }
        j = null;
        b = SC.Enumerator._pushContext(b);
        return f
    },
    invokeWhile: function(d, i) {
        var f = this.get ? this.get("length") : this.length;
        if (f <= 0) {
            return null
        }
        var j;
        var h = [];
        var c = arguments.length;
        if (c > 2) {
            for (j = 2; j < c; j++) {
                h.push(arguments[j])
            }
        }
        var g = d;
        var k = null;
        var b = SC.Enumerator._popContext();
        for (j = 0; (g === d) && (j < f); j++) {
            var e = this.nextObject(j, k, b);
            var a = e ? e[i] : null;
            if (a) {
                g = a.apply(e, h)
            }
            k = e
        }
        k = null;
        b = SC.Enumerator._pushContext(b);
        return g
    },
    toArray: function() {
        var a = [];
        this.forEach(function(b) {
            a.push(b)
        },
        this);
        return a
    }
};
SC._buildReducerFor = function(a, b) {
    return function(d, e) {
        var f = this[a];
        if (SC.typeOf(f) !== SC.T_FUNCTION) {
            return this.unknownProperty ? this.unknownProperty(d, e) : null
        } else {
            var c = SC.Enumerable.reduce.call(this, f, null, b);
            return c
        }
    }.property("[]")
};
SC.Reducers = {
    "[]": function(a, b) {
        return this
    }.property(),
    enumerableContentDidChange: function(b, a) {
        this.notifyPropertyChange("[]");
        return this
    },
    reducedProperty: function(i, g, f) {
        if (!i || i.charAt(0) !== "@") {
            return undefined
        }
        var d = i.match(/^@([^(]*)(\(([^)]*)\))?$/);
        if (!d || d.length < 2) {
            return undefined
        }
        var h = d[1];
        var j = d[3];
        h = "reduce" + h.slice(0, 1).toUpperCase() + h.slice(1);
        var a = this[h];
        if (SC.typeOf(a) !== SC.T_FUNCTION) {
            return undefined
        }
        if (f === NO) {
            return SC.Enumerable.reduce.call(this, a, null, j)
        }
        var c = SC._buildReducerFor(h, j);
        var b = this.constructor.prototype;
        if (b) {
            b[i] = c;
            var e = b._properties || [];
            e.push(i);
            b._properties = e;
            this.registerDependentKey(i, "[]")
        }
        return SC.Enumerable.reduce.call(this, a, null, j)
    },
    reduceMax: function(a, d, b, f, c) {
        if (c && d) {
            d = d.get ? d.get(c) : d[c]
        }
        if (a === null) {
            return d
        }
        return (d > a) ? d: a
    },
    reduceMaxObject: function(b, f, c, g, d) {
        var a = b,
        h = f;
        if (d) {
            if (f) {
                h = f.get ? f.get(d) : f[d]
            }
            if (b) {
                a = b.get ? b.get(d) : b[d]
            }
        }
        if (a === null) {
            return f
        }
        return (h > a) ? f: b
    },
    reduceMin: function(a, d, b, f, c) {
        if (c && d) {
            d = d.get ? d.get(c) : d[c]
        }
        if (a === null) {
            return d
        }
        return (d < a) ? d: a
    },
    reduceMinObject: function(b, f, c, g, d) {
        var a = b,
        h = f;
        if (d) {
            if (f) {
                h = f.get ? f.get(d) : f[d]
            }
            if (b) {
                a = b.get ? b.get(d) : b[d]
            }
        }
        if (a === null) {
            return f
        }
        return (h < a) ? f: b
    },
    reduceAverage: function(b, g, d, h, f) {
        if (f && g) {
            g = g.get ? g.get(f) : g[f]
        }
        var c = (b || 0) + g;
        var a = h.get ? h.get("length") : h.length;
        if (d >= a - 1) {
            c = c / a
        }
        return c
    },
    reduceSum: function(a, d, b, f, c) {
        if (c && d) {
            d = d.get ? d.get(c) : d[c]
        }
        return (a === null) ? d: a + d
    }
};
SC.mixin(SC.Enumerable, SC.Reducers);
SC.mixin(Array.prototype, SC.Reducers);
Array.prototype.isEnumerable = YES; (function() {
    var a = {
        nextObject: SC.Enumerable.nextObject,
        enumerator: SC.Enumerable.enumerator,
        firstObject: SC.Enumerable.firstObject,
        sortProperty: SC.Enumerable.sortProperty,
        mapProperty: function(g) {
            var e = this.length;
            var f = [];
            for (var d = 0; d < e; d++) {
                var h = this[d];
                f[d] = h ? (h.get ? h.get(g) : h[g]) : null
            }
            return f
        },
        filterProperty: function(h, j) {
            var f = this.length;
            var g = [];
            for (var e = 0; e < f; e++) {
                var i = this[e];
                var k = i ? (i.get ? i.get(h) : i[h]) : null;
                var d = (j === undefined) ? !!k: SC.isEqual(k, j);
                if (d) {
                    g.push(i)
                }
            }
            return g
        },
        find: function(j, i) {
            if (typeof j !== "function") {
                throw new TypeError()
            }
            var e = this.length;
            if (i === undefined) {
                i = null
            }
            var g,
            f = null,
            h = NO;
            for (var d = 0; d < e && !h; d++) {
                g = this[d];
                if (h = j.call(i, g, d, this)) {
                    f = g
                }
            }
            g = null;
            return f
        },
        findProperty: function(g, j) {
            var e = this.length;
            var h,
            k,
            i = NO,
            f = null;
            for (var d = 0; d < e && !i; d++) {
                k = (h = this[d]) ? (h.get ? h.get(g) : h[g]) : null;
                i = (j === undefined) ? !!k: SC.isEqual(k, j);
                if (i) {
                    f = h
                }
            }
            h = null;
            return f
        },
        everyProperty: function(g, i) {
            var e = this.length;
            var f = YES;
            for (var d = 0; f && (d < e); d++) {
                var h = this[d];
                var j = h ? (h.get ? h.get(g) : h[g]) : null;
                f = (i === undefined) ? !!j: SC.isEqual(j, i)
            }
            return f
        },
        someProperty: function(g, i) {
            var e = this.length;
            var f = NO;
            for (var d = 0; ! f && (d < e);
            d++) {
                var h = this[d];
                var j = h ? (h.get ? h.get(g) : h[g]) : null;
                f = (i === undefined) ? !!j: SC.isEqual(j, i)
            }
            return f
        },
        invoke: function(f) {
            var e = this.length;
            if (e <= 0) {
                return []
            }
            var d;
            var h = [];
            var j = arguments.length;
            if (j > 1) {
                for (d = 1; d < j; d++) {
                    h.push(arguments[d])
                }
            }
            var g = [];
            for (d = 0;
            d < e; d++) {
                var i = this[d];
                var k = i ? i[f] : null;
                if (k) {
                    g[d] = k.apply(i, h)
                }
            }
            return g
        },
        invokeWhile: function(f, k) {
            var h = this.length;
            if (h <= 0) {
                return null
            }
            var l;
            var j = [];
            var e = arguments.length;
            if (e > 2) {
                for (l = 2; l < e; l++) {
                    j.push(arguments[l])
                }
            }
            var i = f;
            for (l = 0; (i === f) && (l < h); l++) {
                var g = this[l];
                var d = g ? g[k] : null;
                if (d) {
                    i = d.apply(g, j)
                }
            }
            return i
        },
        toArray: function() {
            var e = this.length;
            if (e <= 0) {
                return []
            }
            var f = [];
            for (var d = 0;
            d < e; d++) {
                var g = this[d];
                f.push(g)
            }
            return f
        },
        getEach: function(g) {
            var f = [];
            var e = this.length;
            for (var d = 0; d < e; d++) {
                var h = this[d];
                f[d] = h ? (h.get ? h.get(g) : h[g]) : null
            }
            return f
        },
        setEach: function(f, g) {
            var e = this.length;
            for (var d = 0; d < e; d++) {
                var h = this[d];
                if (h) {
                    if (h.set) {
                        h.set(f, g)
                    } else {
                        h[f] = g
                    }
                }
            }
            return this
        }
    };
    var c = {
        forEach: function(h, g) {
            if (typeof h !== "function") {
                throw new TypeError()
            }
            var e = this.length;
            if (g === undefined) {
                g = null
            }
            for (var d = 0; d < e; d++) {
                var f = this[d];
                h.call(g, f, d, this)
            }
            return this
        },
        map: function(i, h) {
            if (typeof i !== "function") {
                throw new TypeError()
            }
            var e = this.length;
            if (h === undefined) {
                h = null
            }
            var f = [];
            for (var d = 0; d < e; d++) {
                var g = this[d];
                f[d] = i.call(h, g, d, this)
            }
            return f
        },
        filter: function(i, h) {
            if (typeof i !== "function") {
                throw new TypeError()
            }
            var e = this.length;
            if (h === undefined) {
                h = null
            }
            var f = [];
            for (var d = 0; d < e; d++) {
                var g = this[d];
                if (i.call(h, g, d, this)) {
                    f.push(g)
                }
            }
            return f
        },
        every: function(i, h) {
            if (typeof i !== "function") {
                throw new TypeError()
            }
            var e = this.length;
            if (h === undefined) {
                h = null
            }
            var f = YES;
            for (var d = 0; f && (d < e); d++) {
                var g = this[d];
                if (!i.call(h, g, d, this)) {
                    f = NO
                }
            }
            return f
        },
        some: function(i, h) {
            if (typeof i !== "function") {
                throw new TypeError()
            }
            var e = this.length;
            if (h === undefined) {
                h = null
            }
            var f = NO;
            for (var d = 0; (!f) && (d < e); d++) {
                var g = this[d];
                if (i.call(h, g, d, this)) {
                    f = YES
                }
            }
            return f
        },
        reduce: function(j, f, i) {
            if (typeof j !== "function") {
                throw new TypeError()
            }
            var e = this.length;
            if (e === 0 && f === undefined) {
                throw new TypeError()
            }
            var g = f;
            for (var d = 0;
            d < e; d++) {
                var h = this[d];
                if (h !== null) {
                    if (g === undefined) {
                        g = h
                    } else {
                        g = j.call(null, g, h, d, this, i)
                    }
                }
            }
            if (g === undefined) {
                throw new TypeError()
            }
            return g
        }
    };
    for (var b in c) {
        if (!c.hasOwnProperty(b)) {
            continue
        }
        if (!Array.prototype[b] || ((typeof Prototype === "object") && Prototype.Version.match(/^1\.6/))) {
            Array.prototype[b] = c[b]
        }
    }
    SC.mixin(Array.prototype, a)
})();
SC.RangeObserver = {
    isRangeObserver: YES,
    toString: function() {
        var a = this.indexes ? this.indexes.toString() : "SC.IndexSet<..>";
        return a.replace("IndexSet", "RangeObserver(%@)".fmt(SC.guidFor(this)))
    },
    create: function(d, f, e, g, c, a) {
        var b = SC.beget(this);
        b.source = d;
        b.indexes = f ? f.frozenCopy() : null;
        b.target = e;
        b.method = g;
        b.context = c;
        b.isDeep = a || NO;
        b.beginObserving();
        return b
    },
    extend: function(e) {
        var d = SC.beget(this),
        c = arguments,
        b = c.length,
        a;
        for (a = 0; a < b; a++) {
            SC.mixin(d, c[a])
        }
        return d
    },
    destroy: function(a) {
        this.endObserving();
        return this
    },
    update: function(a, b) {
        if (this.indexes && this.indexes.isEqual(b)) {
            return this
        }
        this.indexes = b ? b.frozenCopy() : null;
        this.endObserving().beginObserving();
        return this
    },
    beginObserving: function() {
        if (!this.isDeep) {
            return this
        }
        var b = this.observing;
        if (!b) {
            b = this.observing = SC.CoreSet.create()
        }
        var a = this._beginObservingForEach;
        if (!a) {
            a = this._beginObservingForEach = function(c) {
                var d = this.source.objectAt(c);
                if (d && d.addObserver) {
                    b.push(d);
                    d._kvo_needsRangeObserver = YES
                }
            }
        }
        this.indexes.forEach(a, this);
        this.isObserving = NO;
        SC.Observers.addPendingRangeObserver(this);
        return this
    },
    setupPending: function(a) {
        var d = this.observing;
        if (this.isObserving || !d || (d.get("length") === 0)) {
            return YES
        }
        if (d.contains(a)) {
            this.isObserving = YES;
            var b = this._setupPendingForEach;
            if (!b) {
                var c = this.source,
                e = this.objectPropertyDidChange;
                b = this._setupPendingForEach = function(f) {
                    var i = this.source.objectAt(f),
                    g = SC.guidFor(i),
                    h;
                    if (i && i.addObserver) {
                        d.push(i);
                        i.addObserver("*", this, e);
                        h = this[g];
                        if (h === undefined || h === null) {
                            this[g] = f
                        } else {
                            if (h.isIndexSet) {
                                h.add(f)
                            } else {
                                h = this[g] = SC.IndexSet.create(h).add(f)
                            }
                        }
                    }
                }
            }
            this.indexes.forEach(b, this);
            return YES
        } else {
            return NO
        }
    },
    endObserving: function() {
        if (!this.isDeep) {
            return this
        }
        var e = this.observing;
        if (this.isObserving) {
            var b = this.objectPropertyDidChange,
            c = this.source,
            a,
            f,
            d;
            if (e) {
                f = e.length;
                for (a = 0; a < f; a++) {
                    d = e[a];
                    d.removeObserver("*", this, b);
                    this[SC.guidFor(d)] = null
                }
                e.length = 0
            }
            this.isObserving = NO
        }
        if (e) {
            e.clear()
        }
        return this
    },
    rangeDidChange: function(b) {
        var a = this.indexes;
        if (!b || !a || a.intersects(b)) {
            this.endObserving();
            this.method.call(this.target, this.source, null, "[]", b, this.context);
            this.beginObserving()
        }
        return this
    },
    objectPropertyDidChange: function(d, f, g, a) {
        var e = this.context,
        h = this.method,
        c = SC.guidFor(d),
        b = this[c];
        if (b && !b.isIndexSet) {
            b = this[c] = SC.IndexSet.create(b).freeze()
        }
        if (e) {
            h.call(this.target, this.source, d, f, b, e, a)
        } else {
            h.call(this.target, this.source, d, f, b, a)
        }
    }
};
sc_require("mixins/observable");
sc_require("mixins/enumerable");
sc_require("system/range_observer");
SC.OUT_OF_RANGE_EXCEPTION = "Index out of range";
SC.Array = {
    isSCArray: YES,
    replace: function(a, c, b) {
        throw "replace() must be implemented to support SC.Array"
    },
    objectAt: function(a) {
        if (a < 0) {
            return undefined
        }
        if (a >= this.get("length")) {
            return undefined
        }
        return this.get(a)
    },
    "[]": function(a, b) {
        if (b !== undefined) {
            this.replace(0, this.get("length"), b)
        }
        return this
    }.property(),
    insertAt: function(a, b) {
        if (a > this.get("length")) {
            throw SC.OUT_OF_RANGE_EXCEPTION
        }
        this.replace(a, 0, [b]);
        return this
    },
    removeAt: function(d, a) {
        var c = 0,
        b = [];
        if (typeof d === SC.T_NUMBER) {
            if ((d < 0) || (d >= this.get("length"))) {
                throw SC.OUT_OF_RANGE_EXCEPTION
            }
            if (a === undefined) {
                this.replace(d, 1, b);
                return this
            } else {
                d = SC.IndexSet.create(d, a)
            }
        }
        this.beginPropertyChanges();
        d.forEachRange(function(f, e) {
            f -= c;
            c += e;
            this.replace(f, e, b)
        },
        this);
        this.endPropertyChanges();
        return this
    },
    removeObject: function(b) {
        var c = this.get("length") || 0;
        while (--c >= 0) {
            var a = this.objectAt(c);
            if (a == b) {
                this.removeAt(c)
            }
        }
        return this
    },
    removeObjects: function(a) {
        this.beginPropertyChanges();
        a.forEach(function(b) {
            this.removeObject(b)
        },
        this);
        this.endPropertyChanges();
        return this
    },
    pushObject: function(a) {
        this.insertAt(this.get("length"), a);
        return a
    },
    pushObjects: function(a) {
        this.beginPropertyChanges();
        a.forEach(function(b) {
            this.pushObject(b)
        },
        this);
        this.endPropertyChanges();
        return this
    },
    popObject: function() {
        var a = this.get("length");
        if (a === 0) {
            return null
        }
        var b = this.objectAt(a - 1);
        this.removeAt(a - 1);
        return b
    },
    shiftObject: function() {
        if (this.get("length") === 0) {
            return null
        }
        var a = this.objectAt(0);
        this.removeAt(0);
        return a
    },
    unshiftObject: function(a) {
        this.insertAt(0, a);
        return a
    },
    unshiftObjects: function(a) {
        this.beginPropertyChanges();
        a.forEach(function(b) {
            this.unshiftObject(b)
        },
        this);
        this.endPropertyChanges();
        return this
    },
    isEqual: function(a) {
        if (!a) {
            return false
        }
        if (a == this) {
            return true
        }
        var b = a.get("length");
        if (b != this.get("length")) {
            return false
        }
        while (--b >= 0) {
            if (!SC.isEqual(a.objectAt(b), this.objectAt(b))) {
                return false
            }
        }
        return true
    },
    compact: function() {
        return this.without(null)
    },
    without: function(b) {
        if (this.indexOf(b) < 0) {
            return this
        }
        var a = [];
        this.forEach(function(c) {
            if (c !== b) {
                a[a.length] = c
            }
        });
        return a
    },
    uniq: function() {
        var a = [];
        this.forEach(function(b) {
            if (a.indexOf(b) < 0) {
                a[a.length] = b
            }
        });
        return a
    },
    rangeObserverClass: SC.RangeObserver,
    addRangeObserver: function(d, f, h, e) {
        var a = this._array_rangeObservers;
        if (!a) {
            a = this._array_rangeObservers = SC.CoreSet.create()
        }
        if (this._array_oldLength === undefined) {
            this._array_oldLength = this.get("length")
        }
        var g = this.rangeObserverClass;
        var b = NO;
        var c = g.create(this, d, f, h, e, b);
        a.add(c);
        if (!this._array_isNotifyingRangeObservers) {
            this._array_isNotifyingRangeObservers = YES;
            this.addObserver("[]", this, this._array_notifyRangeObservers)
        }
        return c
    },
    updateRangeObserver: function(b, a) {
        return b.update(this, a)
    },
    removeRangeObserver: function(c) {
        var b = c.destroy(this);
        var a = this._array_rangeObservers;
        if (a) {
            a.remove(c)
        }
        return b
    },
    enumerableContentDidChange: function(h, g, f) {
        var a = this._array_rangeObservers,
        d = this._array_oldLength,
        e,
        c,
        b;
        this.beginPropertyChanges();
        this.notifyPropertyChange("length");
        if (a && a.length > 0) {
            if (d === undefined) {
                d = 0
            }
            this._array_oldLength = e = this.get("length");
            if (h === undefined) {
                h = 0
            }
            if (f === undefined) {
                f = e - d
            }
            if (f !== 0 || g === undefined) {
                c = e - h;
                if (f < 0) {
                    c -= f
                }
            } else {
                c = g
            }
            b = this._array_rangeChanges;
            if (!b) {
                b = this._array_rangeChanges = SC.IndexSet.create()
            }
            b.add(h, c)
        }
        this.notifyPropertyChange("[]");
        this.endPropertyChanges();
        return this
    },
    _array_notifyRangeObservers: function() {
        var c = this._array_rangeObservers,
        d = this._array_rangeChanges,
        b = c ? c.length: 0,
        a,
        e;
        if (b > 0 && d && d.length > 0) {
            for (a = 0; a < b; a++) {
                c[a].rangeDidChange(d)
            }
            d.clear()
        }
    }
};
SC.mixin(Array.prototype, SC.Array);
SC.Array = SC.mixin({},
SC.Enumerable, SC.Array);
SC.Array.slice = function(b, d) {
    var a = [];
    var c = this.get("length");
    if (SC.none(b)) {
        b = 0
    }
    if (SC.none(d) || (d > c)) {
        d = c
    }
    while (b < d) {
        a[a.length] = this.objectAt(b++)
    }
    return a
};
SC.Array.indexOf = function(d, c) {
    var b,
    a = this.get("length");
    if (c === undefined) {
        c = 0
    } else {
        c = (c < 0) ? Math.ceil(c) : Math.floor(c)
    }
    if (c < 0) {
        c += a
    }
    for (b = c; b < a; b++) {
        if (this.objectAt(b) === d) {
            return b
        }
    }
    return - 1
};
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = SC.Array.indexOf
}
SC.Array.lastIndexOf = function(d, c) {
    var b,
    a = this.get("length");
    if (c === undefined) {
        c = a - 1
    } else {
        c = (c < 0) ? Math.ceil(c) : Math.floor(c)
    }
    if (c < 0) {
        c += a
    }
    for (b = c; b >= 0; b--) {
        if (this.objectAt(b) === d) {
            return b
        }
    }
    return - 1
};
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = SC.Array.lastIndexOf
} (function() {
    SC.mixin(Array.prototype, {
        replace: function(d, g, f) {
            if (this.isFrozen) {
                throw SC.FROZEN_ERROR
            }
            if (!f || f.length === 0) {
                this.splice(d, g)
            } else {
                var e = [d, g].concat(f);
                this.splice.apply(this, e)
            }
            var c = f ? (f.get ? f.get("length") : f.length) : 0;
            this.enumerableContentDidChange(d, g, c - g);
            return this
        },
        unknownProperty: function(d, e) {
            var c = this.reducedProperty(d, e);
            if ((e !== undefined) && c === undefined) {
                c = this[d] = e
            }
            return c
        }
    });
    var b = Array.prototype.indexOf;
    if (!b || (b === SC.Array.indexOf)) {
        Array.prototype.indexOf = function(f, e) {
            var d,
            c = this.length;
            if (e === undefined) {
                e = 0
            } else {
                e = (e < 0) ? Math.ceil(e) : Math.floor(e)
            }
            if (e < 0) {
                e += c
            }
            for (d = e;
            d < c; d++) {
                if (this[d] === f) {
                    return d
                }
            }
            return - 1
        }
    }
    var a = Array.prototype.lastIndexOf;
    if (!a || (a === SC.Array.lastIndexOf)) {
        Array.prototype.lastIndexOf = function(f, e) {
            var d,
            c = this.length;
            if (e === undefined) {
                e = c - 1
            } else {
                e = (e < 0) ? Math.ceil(e) : Math.floor(e)
            }
            if (e < 0) {
                e += c
            }
            for (d = e;
            d >= 0; d--) {
                if (this[d] === f) {
                    return d
                }
            }
            return - 1
        }
    }
})();
SC.Comparable = {
    isComparable: YES,
    compare: function(d, c) {
        throw "%@.compare() is not implemented".fmt(this.toString())
    }
};
SC.Copyable = {
    isCopyable: YES,
    copy: function() {
        throw "%@.copy() is not implemented"
    },
    frozenCopy: function() {
        var a = this.get ? this.get("isFrozen") : this.isFrozen;
        if (a === YES) {
            return this
        } else {
            if (a === undefined) {
                throw "%@ does not support freezing".fmt(this)
            } else {
                return this.copy().freeze()
            }
        }
    }
};
SC.mixin(Array.prototype, SC.Copyable);
Array.prototype.copy = Array.prototype.slice;
SC.DelegateSupport = {
    delegateFor: function(c) {
        var b = 1,
        a = arguments.length,
        d;
        while (b < a) {
            d = arguments[b];
            if (d && d[c] !== undefined) {
                return d
            }
            b++
        }
        return (this[c] !== undefined) ? this: null
    },
    invokeDelegateMethod: function(c, a, b) {
        b = SC.A(arguments);
        b = b.slice(2, b.length);
        if (!c || !c[a]) {
            c = this
        }
        var d = c[a];
        return d ? d.apply(c, b) : null
    },
    getDelegateProperty: function(d, e) {
        var b = 1,
        a = arguments.length,
        c;
        while (b < a) {
            c = arguments[b++];
            if (c && c[d] !== undefined) {
                return c.get ? c.get(d) : c[d]
            }
        }
        return (this[d] !== undefined) ? this.get(d) : undefined
    }
};
SC.FROZEN_ERROR = new Error("Cannot modify a frozen object");
SC.Freezable = {
    isFreezable: YES,
    isFrozen: NO,
    freeze: function() {
        if (this.set) {
            this.set("isFrozen", YES)
        } else {
            this.isFrozen = YES
        }
        return this
    }
};
SC.mixin(Array.prototype, SC.Freezable);
sc_require("mixins/enumerable");
sc_require("mixins/observable");
sc_require("mixins/freezable");
sc_require("mixins/copyable");
SC.Set = SC.mixin({},
SC.Enumerable, SC.Observable, SC.Freezable, {
    create: function(b) {
        var c,
        a,
        d = SC.Set._pool,
        e = this.isObservable;
        if (!e && b === undefined && d.length > 0) {
            c = d.pop()
        } else {
            c = SC.beget(this);
            if (e) {
                c.initObservable()
            }
            if (b && b.isEnumerable && b.get("length") > 0) {
                c.isObservable = NO;
                if (b.isSCArray) {
                    a = b.get ? b.get("length") : b.length;
                    while (--a >= 0) {
                        c.add(b.objectAt(a))
                    }
                } else {
                    if (b.isSet) {
                        a = b.length;
                        while (--a >= 0) {
                            c.add(b[a])
                        }
                    } else {
                        b.forEach(function(f) {
                            c.add(f)
                        },
                        this)
                    }
                }
                c.isObservable = e
            }
        }
        return c
    },
    isSet: YES,
    length: 0,
    firstObject: function() {
        return (this.length > 0) ? this[0] : undefined
    }.property(),
    clear: function() {
        if (this.isFrozen) {
            throw SC.FROZEN_ERROR
        }
        this.length = 0;
        return this
    },
    contains: function(b) {
        if (b === null) {
            return NO
        }
        var a = this[SC.hashFor(b)];
        return (!SC.none(a) && (a < this.length) && (this[a] === b))
    },
    isEqual: function(a) {
        if (!a || !a.isSet || (a.get("length") !== this.get("length"))) {
            return NO
        }
        var b = this.get("length");
        while (--b >= 0) {
            if (!a.contains(this[b])) {
                return NO
            }
        }
        return YES
    },
    add: function(d) {
        if (this.isFrozen) {
            throw SC.FROZEN_ERROR
        }
        if (d === null || d === undefined) {
            return this
        }
        var c = SC.hashFor(d);
        var b = this[c];
        var a = this.length;
        if ((b === null || b === undefined) || (b >= a) || (this[b] !== d)) {
            this[a] = d;
            this[c] = a;
            this.length = a + 1
        }
        if (this.isObservable) {
            this.enumerableContentDidChange()
        }
        return this
    },
    addEach: function(c) {
        if (this.isFrozen) {
            throw SC.FROZEN_ERROR
        }
        if (!c || !c.isEnumerable) {
            throw "%@.addEach must pass enumerable".fmt(this)
        }
        var a,
        b = this.isObservable;
        if (b) {
            this.beginPropertyChanges()
        }
        if (c.isSCArray) {
            a = c.get("length");
            while (--a >= 0) {
                this.add(c.objectAt(a))
            }
        } else {
            if (c.isSet) {
                a = c.length;
                while (--a >= 0) {
                    this.add(c[a])
                }
            } else {
                c.forEach(function(d) {
                    this.add(d)
                },
                this)
            }
        }
        if (b) {
            this.endPropertyChanges()
        }
        return this
    },
    remove: function(d) {
        if (this.isFrozen) {
            throw SC.FROZEN_ERROR
        }
        if (SC.none(d)) {
            return this
        }
        var c = SC.hashFor(d);
        var b = this[c];
        var a = this.length;
        if (SC.none(b) || (b >= a) || (this[b] !== d)) {
            return this
        }
        delete this[c];
        if (b < (a - 1)) {
            d = this[b] = this[a - 1];
            this[SC.hashFor(d)] = b
        }
        this.length = a - 1;
        if (this.isObservable) {
            this.enumerableContentDidChange()
        }
        return this
    },
    pop: function() {
        if (this.isFrozen) {
            throw SC.FROZEN_ERROR
        }
        var a = (this.length > 0) ? this[this.length - 1] : null;
        if (a) {
            this.remove(a)
        }
        return a
    },
    removeEach: function(c) {
        if (this.isFrozen) {
            throw SC.FROZEN_ERROR
        }
        if (!c || !c.isEnumerable) {
            throw "%@.addEach must pass enumerable".fmt(this)
        }
        var a,
        b = this.isObservable;
        if (b) {
            this.beginPropertyChanges()
        }
        if (c.isSCArray) {
            a = c.get("length");
            while (--a >= 0) {
                this.remove(c.objectAt(a))
            }
        } else {
            if (c.isSet) {
                a = c.length;
                while (--a >= 0) {
                    this.remove(c[a])
                }
            } else {
                c.forEach(function(d) {
                    this.remove(d)
                },
                this)
            }
        }
        if (b) {
            this.endPropertyChanges()
        }
        return this
    },
    copy: function() {
        return this.constructor.create(this)
    },
    destroy: function() {
        this.isFrozen = NO;
        if (!this.isObservable) {
            SC.Set._pool.push(this.clear())
        }
        return this
    },
    forEach: function(c, d) {
        var b = this.length;
        if (!d) {
            d = this
        }
        for (var a = 0; a < b;
        a++) {
            c.call(d, this[a], a, this)
        }
        return this
    },
    toString: function() {
        var b = this.length,
        a,
        c = [];
        for (a = 0; a < b; a++) {
            c[a] = this[a]
        }
        return "SC.Set<%@>".fmt(c.join(","))
    },
    _pool: [],
    isObservable: YES
});
SC.Set.constructor = SC.Set;
SC.Set.clone = SC.Set.copy;
SC.Set.push = SC.Set.unshift = SC.Set.add;
SC.Set.shift = SC.Set.pop;
SC.Set.addObject = SC.Set.add;
SC.Set.removeObject = SC.Set.remove;
SC.Set._pool = [];
SC.CoreSet = SC.beget(SC.Set);
SC.CoreSet.isObservable = NO;
SC.CoreSet.constructor = SC.CoreSet;
sc_require("core");
sc_require("mixins/observable");
sc_require("mixins/array");
sc_require("system/set");
SC.BENCHMARK_OBJECTS = NO;
SC._object_extend = function _object_extend(g, f) {
    if (!f) {
        throw "SC.Object.extend expects a non-null value.  Did you forget to 'sc_require' something?  Or were you passing a Protocol to extend() as if it were a mixin?"
    }
    g._kvo_cloned = null;
    var w,
    m,
    s,
    e,
    h = g.concatenatedProperties,
    k = SC.K;
    var c,
    b;
    m = (h) ? h.length: 0;
    var a = (m > 0) ? {}: null;
    while (--m >= 0) {
        w = h[m];
        c = g[w];
        b = f[w];
        if (c) {
            if (! (c instanceof Array)) {
                c = SC.$A(c)
            }
            a[w] = (b) ? c.concat(b) : b
        } else {
            if (! (b instanceof Array)) {
                b = SC.$A(b)
            }
            a[w] = b
        }
    }
    var v = g._bindings,
    l = NO;
    var t = g._observers,
    u = NO;
    var i = g._properties,
    d = NO;
    var p,
    j,
    n;
    var r = g.outlets,
    q = NO;
    if (f.outlets) {
        r = (r || SC.EMPTY_ARRAY).concat(f.outlets);
        q = YES
    }
    for (w in f) {
        if (w === "_kvo_cloned") {
            continue
        }
        if (!f.hasOwnProperty(w)) {
            continue
        }
        var o = (a.hasOwnProperty(w) ? a[w] : null) || f[w];
        if (w.slice( - 7) === "Binding") {
            if (!l) {
                v = (v || SC.EMPTY_ARRAY).slice();
                l = YES
            }
            if (v === null) {
                v = (g._bindings || SC.EMPTY_ARRAY).slice()
            }
            v[v.length] = w
        } else {
            if (o && (o instanceof Function)) {
                if (!o.superclass && (o !== (e = g[w]))) {
                    o.superclass = o.base = e || k
                }
                if (o.propertyPaths) {
                    if (!u) {
                        t = (t || SC.EMPTY_ARRAY).slice();
                        u = YES
                    }
                    t[t.length] = w
                } else {
                    if (p = o.localPropertyPaths) {
                        j = p.length;
                        while (--j >= 0) {
                            n = g._kvo_for(SC.keyFor("_kvo_local", p[j]), SC.Set);
                            n.add(w);
                            g._kvo_for("_kvo_observed_keys", SC.CoreSet).add(p[j])
                        }
                    } else {
                        if (o.dependentKeys) {
                            if (!d) {
                                i = (i || SC.EMPTY_ARRAY).slice();
                                d = YES
                            }
                            i[i.length] = w
                        } else {
                            if (o.autoconfiguredOutlet) {
                                if (!q) {
                                    r = (r || SC.EMPTY_ARRAY).slice();
                                    q = YES
                                }
                                r[r.length] = w
                            }
                        }
                    }
                }
            }
        }
        g[w] = o
    }
    if (f.hasOwnProperty("toString")) {
        w = "toString";
        o = (a.hasOwnProperty(w) ? a[w] : null) || f[w];
        if (!o.superclass && (o !== (e = g[w]))) {
            o.superclass = o.base = e || k
        }
        g[w] = o
    }
    g._bindings = v || [];
    g._observers = t || [];
    g._properties = i || [];
    g.outlets = r || [];
    return g
};
SC.Object = function(a) {
    return this._object_init(a)
};
SC.mixin(SC.Object, {
    mixin: function(b) {
        var a = arguments.length,
        c;
        for (c = 0; c < a; c++) {
            SC.mixin(this, arguments[c])
        }
        return this
    },
    superclass: null,
    extend: function(e) {
        var d = SC.BENCHMARK_OBJECTS;
        if (d) {
            SC.Benchmark.start("SC.Object.extend")
        }
        var g,
        c = function(h) {
            return this._object_init(h)
        };
        for (g in this) {
            if (!this.hasOwnProperty(g)) {
                continue
            }
            c[g] = this[g]
        }
        if (this.hasOwnProperty("toString")) {
            c.toString = this.toString
        }
        c.superclass = this;
        SC.generateGuid(c);
        c.subclasses = SC.Set.create();
        this.subclasses.add(c);
        var f = (c.prototype = SC.beget(this.prototype));
        var b,
        a = arguments.length;
        for (b = 0; b < a; b++) {
            SC._object_extend(f, arguments[b])
        }
        f.constructor = c;
        if (d) {
            SC.Benchmark.end("SC.Object.extend")
        }
        return c
    },
    create: function(a) {
        var b = this;
        return new b(arguments)
    },
    isClass: YES,
    subclasses: SC.Set.create(),
    toString: function() {
        return SC._object_className(this)
    },
    subclassOf: function(b) {
        if (this === b) {
            return NO
        }
        var a = this;
        while (a = a.superclass) {
            if (a === b) {
                return YES
            }
        }
        return NO
    },
    hasSubclass: function(a) {
        return (a && a.subclassOf) ? a.subclassOf(this) : NO
    },
    kindOf: function(a) {
        return (this === a) || this.subclassOf(a)
    }
});
SC.Object.prototype = {
    _kvo_enabled: YES,
    _object_init: function(c) {
        var b,
        a = (c) ? c.length: 0;
        for (b = 0; b < a; b++) {
            SC._object_extend(this, c[b])
        }
        SC.generateGuid(this);
        this.init();
        var d = this.initMixin;
        a = (d) ? d.length: 0;
        for (b = 0; b < a; b++) {
            d[b].call(this)
        }
        return this
    },
    mixin: function() {
        var b,
        a = arguments.length;
        for (b = 0; b < a; b++) {
            SC.mixin(this, arguments[b])
        }
        for (b = 0; b < a; b++) {
            var c = arguments[b].initMixin;
            if (c) {
                c.call(this)
            }
        }
        return this
    },
    init: function() {
        this.initObservable();
        return this
    },
    isDestroyed: NO,
    destroy: function() {
        if (this.get("isDestroyed")) {
            return this
        }
        this.set("isDestroyed", YES);
        var b,
        c = this.destroyMixin,
        a = (c) ? c.length: 0;
        for (b = 0; b < a; b++) {
            c[b].call(this)
        }
        return this
    },
    isObject: true,
    respondsTo: function(a) {
        return !! (SC.typeOf(this[a]) === SC.T_FUNCTION)
    },
    tryToPerform: function(b, c, a) {
        return this.respondsTo(b) && (this[b](c, a) !== NO)
    },
    superclass: function(b) {
        var a = arguments.callee.caller;
        if (!a) {
            throw "superclass cannot determine the caller method"
        }
        return a.superclass ? a.superclass.apply(this, arguments) : null
    },
    instanceOf: function(a) {
        return this.constructor === a
    },
    kindOf: function(a) {
        return this.constructor.kindOf(a)
    },
    toString: function() {
        if (!this._object_toString) {
            var a = SC._object_className(this.constructor);
            var b = "%@:%@".fmt(a, SC.guidFor(this));
            if (a) {
                this._object_toString = b
            } else {
                return b
            }
        }
        return this._object_toString
    },
    awake: function(a) {
        this.outlets.forEach(function(b) {
            this.get(b)
        },
        this);
        this.bindings.invoke("sync")
    },
    invokeOnce: function(a) {
        SC.RunLoop.currentRunLoop.invokeOnce(this, a);
        return this
    },
    invokeLast: function(a) {
        SC.RunLoop.currentRunLoop.invokeLast(this, a);
        return this
    },
    concatenatedProperties: ["concatenatedProperties", "initMixin", "destroyMixin"]
};
SC.Object.prototype.constructor = SC.Object;
SC.mixin(SC.Object.prototype, SC.Observable);
function findClassNames() {
    if (SC._object_foundObjectClassNames) {
        return
    }
    SC._object_foundObjectClassNames = true;
    var b = [];
    var a = function(c, d, g) {
        g--;
        if (b.indexOf(d) >= 0) {
            return
        }
        b.push(d);
        for (var e in d) {
            if (e == "__scope__") {
                continue
            }
            if (e == "superclass") {
                continue
            }
            if (!e.match(/^[A-Z0-9]/)) {
                continue
            }
            var h = (c) ? [c, e].join(".") : e;
            var f = d[e];
            switch (SC.typeOf(f)) {
            case SC.T_CLASS:
                if (!f._object_className) {
                    f._object_className = h
                }
                if (g >= 0) {
                    a(h, f, g)
                }
                break;
            case SC.T_OBJECT:
                if (g >= 0) {
                    a(h, f, g)
                }
                break;
            case SC.T_HASH:
                if (((c) || (h === "SC")) && (g >= 0)) {
                    a(h, f, g)
                }
                break;
            default:
                break
            }
        }
    };
    a(null, SC.root, 2) //eh...
}
SC.instanceOf = function(a, b) {
    return !! (a && a.constructor === b)
};
SC.kindOf = function(a, b) {
    if (a && !a.isClass) {
        a = a.constructor
    }
    return !! (a && a.kindOf && a.kindOf(b))
};
SC._object_className = function(b) {
    if (!SC.isReady) {
        return ""
    }
    if (!b._object_className) {
        findClassNames()
    }
    if (b._object_className) {
        return b._object_className
    }
    var a = b;
    while (a && !a._object_className) {
        a = a.superclass
    }
    return (a && a._object_className) ? a._object_className: "Anonymous"
};
sc_require("system/object");
SC._ChainObserver = function(a) {
    this.property = a
};
SC._ChainObserver.createChain = function(d, j, f, a, b) {
    var c = j.split("."),
    h = new SC._ChainObserver(c[0]),
    g = h,
    e = c.length;
    for (var i = 1; i < e; i++) {
        g = g.next = new SC._ChainObserver(c[i])
    }
    h.objectDidChange(d);
    g.target = f;
    g.method = a;
    g.context = b;
    return h
};
SC._ChainObserver.prototype = {
    isChainObserver: true,
    object: null,
    property: null,
    next: null,
    target: null,
    method: null,
    objectDidChange: function(a) {
        if (a === this.object) {
            return
        }
        if (this.object && this.object.removeObserver) {
            this.object.removeObserver(this.property, this, this.propertyDidChange)
        }
        this.object = a;
        if (this.object && this.object.addObserver) {
            this.object.addObserver(this.property, this, this.propertyDidChange)
        }
        this.propertyDidChange()
    },
    propertyDidChange: function() {
        var b = this.object;
        var e = this.property;
        var d = (b && b.get) ? b.get(e) : null;
        if (this.next) {
            this.next.objectDidChange(d)
        }
        var f = this.target,
        g = this.method,
        c = this.context;
        if (f && g) {
            var a = b ? b.propertyRevision: null;
            if (c) {
                g.call(f, b, e, d, c, a)
            } else {
                g.call(f, b, e, d, a)
            }
        }
    },
    destroyChain: function() {
        var a = this.object;
        if (a && a.removeObserver) {
            a.removeObserver(this.property, this, this.propertyDidChange)
        }
        if (this.next) {
            this.next.destroyChain()
        }
        this.next = this.target = this.method = this.object = this.context = null;
        return null
    }
};
sc_require("mixins/observable");
sc_require("system/set");
SC.Observers = {
    queue: [],
    addObserver: function(c, d, e, b) {
        var a;
        if (SC.typeOf(c) === SC.T_STRING) {
            a = SC.tupleForPropertyPath(c, b)
        } else {
            a = c
        }
        if (a) {
            a[0].addObserver(a[1], d, e)
        } else {
            this.queue.push([c, d, e, b])
        }
    },
    removeObserver: function(f, g, h, d) {
        var c,
        b,
        a,
        e;
        a = SC.tupleForPropertyPath(f, d);
        if (a) {
            a[0].removeObserver(a[1], g, h)
        }
        c = this.queue.length;
        b = this.queue;
        while (--c >= 0) {
            e = b[c];
            if ((e[0] === f) && (e[1] === g) && (e[2] == h) && (e[3] === d)) {
                b[c] = null
            }
        }
    },
    addPendingRangeObserver: function(a) {
        var b = this.rangeObservers;
        if (!b) {
            b = this.rangeObservers = SC.CoreSet.create()
        }
        b.add(a);
        return this
    },
    _TMP_OUT: [],
    flush: function(a) {
        var e = this.queue;
        if (e && e.length > 0) {
            var h = (this.queue = []);
            var i = e.length;
            while (--i >= 0) {
                var j = e[i];
                if (!j) {
                    continue
                }
                var f = SC.tupleForPropertyPath(j[0], j[3]);
                if (f) {
                    f[0].addObserver(f[1], j[1], j[2])
                } else {
                    h.push(j)
                }
            }
        }
        if (a._kvo_needsRangeObserver) {
            var g = this.rangeObservers,
            d = g ? g.get("length") : 0,
            b = this._TMP_OUT,
            c;
            for (i = 0; i < d; i++) {
                c = g[i];
                if (c.setupPending(a)) {
                    b.push(c)
                }
            }
            if (b.length > 0) {
                g.removeEach(b)
            }
            b.length = 0;
            a._kvo_needsRangeObserver = NO
        }
    },
    isObservingSuspended: 0,
    _pending: SC.CoreSet.create(),
    objectHasPendingChanges: function(a) {
        this._pending.add(a)
    },
    suspendPropertyObserving: function() {
        this.isObservingSuspended++
    },
    resumePropertyObserving: function() {
        var c;
        if (--this.isObservingSuspended <= 0) {
            c = this._pending;
            this._pending = SC.CoreSet.create();
            var b,
            a = c.length;
            for (b = 0; b < a; b++) {
                c[b]._notifyPropertyObservers()
            }
            c.clear();
            c = null
        }
    }
};
sc_require("system/object");
SC.LOG_BINDINGS = NO;
SC.BENCHMARK_BINDING_NOTIFICATIONS = NO;
SC.BENCHMARK_BINDING_SETUP = NO;
SC.MULTIPLE_PLACEHOLDER = "@@MULT@@";
SC.NULL_PLACEHOLDER = "@@NULL@@";
SC.EMPTY_PLACEHOLDER = "@@EMPTY@@";
SC.Binding = {
    beget: function(b) {
        var a = SC.beget(this);
        a.parentBinding = this;
        if (b !== undefined) {
            a = a.from(b)
        }
        return a
    },
    builder: function() {
        var b = this;
        var a = function(c) {
            return b.beget().from(c)
        };
        a.beget = function() {
            return b.beget()
        };
        return a
    },
    from: function(b, a) {
        if (!b) {
            return this
        }
        var c = (this === SC.Binding) ? this.beget() : this;
        c._fromPropertyPath = b;
        c._fromRoot = a;
        c._fromTuple = null;
        return c
    },
    to: function(b, a) {
        var c = (this === SC.Binding) ? this.beget() : this;
        c._toPropertyPath = b;
        c._toRoot = a;
        c._toTuple = null;
        return c
    },
    connect: function() {
        if (this.isConnected) {
            return this
        }
        this.isConnected = YES;
        this._connectionPending = YES;
        this._syncOnConnect = YES;
        SC.Binding._connectQueue.add(this);
        return this
    },
    _connect: function() {
        if (!this._connectionPending) {
            return
        }
        this._connectionPending = NO;
        var c,
        a;
        var b = SC.BENCHMARK_BINDING_SETUP;
        if (b) {
            SC.Benchmark.start("SC.Binding.connect()")
        }
        c = this._fromPropertyPath;
        a = this._fromRoot;
        if (SC.typeOf(c) === SC.T_STRING) {
            if (c.indexOf(".") === 0) {
                c = c.slice(1);
                if (!a) {
                    a = this._toRoot
                }
            } else {
                if (c.indexOf("*") === 0) {
                    c = [this._fromRoot || this._toRoot, c.slice(1)];
                    a = null
                }
            }
        }
        SC.Observers.addObserver(c, this, this.fromPropertyDidChange, a);
        if (!this._oneWay) {
            c = this._toPropertyPath;
            a = this._toRoot;
            SC.Observers.addObserver(c, this, this.toPropertyDidChange, a)
        }
        if (b) {
            SC.Benchmark.end("SC.Binding.connect()")
        }
        if (this._syncOnConnect) {
            this._syncOnConnect = NO;
            if (b) {
                SC.Benchmark.start("SC.Binding.connect().sync")
            }
            this.sync();
            if (b) {
                SC.Benchmark.end("SC.Binding.connect().sync")
            }
        }
    },
    disconnect: function() {
        if (!this.isConnected) {
            return this
        }
        if (this._connectionPending) {
            this._connectionPending = NO
        } else {
            SC.Observers.removeObserver(this._fromPropertyPath, this, this.fromPropertyDidChange, this._fromRoot);
            if (!this._oneWay) {
                SC.Observers.removeObserver(this._toPropertyPath, this, this.toPropertyDidChange, this._toRoot)
            }
        }
        this.isConnected = NO;
        return this
    },
    fromPropertyDidChange: function(c, b) {
        var a = c ? c.get(b) : null;
        if (a !== this._bindingValue) {
            this._setBindingValue(c, b);
            this._changePending = YES;
            SC.Binding._changeQueue.add(this)
        }
    },
    toPropertyDidChange: function(c, b) {
        if (this._oneWay) {
            return
        }
        var a = c.get(b);
        if (a !== this._transformedBindingValue) {
            this._setBindingValue(c, b);
            this._changePending = YES;
            SC.Binding._changeQueue.add(this)
        }
    },
    _setBindingValue: function(b, a) {
        this._bindingSource = b;
        this._bindingKey = a
    },
    _computeBindingValue: function() {
        var g = this._bindingSource,
        e = this._bindingKey,
        c;
        if (!g) {
            return
        }
        this._bindingValue = c = g.getPath(e);
        var f = this._transforms;
        if (f) {
            var b = f.length;
            for (var a = 0; a < b; a++) {
                var d = f[a];
                c = d(c, this)
            }
        }
        if (this._noError && SC.typeOf(c) === SC.T_ERROR) {
            c = null
        }
        this._transformedBindingValue = c
    },
    _connectQueue: SC.CoreSet.create(),
    _alternateConnectQueue: SC.CoreSet.create(),
    _changeQueue: SC.CoreSet.create(),
    _alternateChangeQueue: SC.CoreSet.create(),
    _changePending: NO,
    flushPendingChanges: function() {
        if (this._isFlushing) {
            return NO
        }
        this._isFlushing = YES;
        SC.Observers.suspendPropertyObserving();
        var b = NO;
        var c = SC.LOG_BINDINGS;
        var a,
        d;
        while ((a = this._connectQueue).length > 0) {
            this._connectQueue = this._alternateConnectQueue;
            this._alternateConnectQueue = a;
            while (d = a.pop()) {
                d._connect()
            }
        }
        while ((a = this._changeQueue).length > 0) {
            if (c) {
                console.log("Begin: Trigger changed bindings")
            }
            b = YES;
            this._changeQueue = this._alternateChangeQueue;
            this._alternateChangeQueue = a;
            while (d = a.pop()) {
                d.applyBindingValue()
            }
            if (c) {
                console.log("End: Trigger changed bindings")
            }
        }
        this._isFlushing = NO;
        SC.Observers.resumePropertyObserving();
        return b
    },
    applyBindingValue: function() {
        this._changePending = NO;
        this._computeBindingTargets();
        this._computeBindingValue();
        var a = this._bindingValue;
        var b = this._transformedBindingValue;
        var c = SC.BENCHMARK_BINDING_NOTIFICATIONS;
        var d = SC.LOG_BINDINGS;
        if (!this._oneWay && this._fromTarget) {
            if (d) {
                console.log("%@: %@ -> %@".fmt(this, a, b))
            }
            if (c) {
                SC.Benchmark.start(this.toString() + "->")
            }
            this._fromTarget.setPathIfChanged(this._fromPropertyKey, a);
            if (c) {
                SC.Benchmark.end(this.toString() + "->")
            }
        }
        if (this._toTarget) {
            if (d) {
                console.log("%@: %@ <- %@".fmt(this, a, b))
            }
            if (c) {
                SC.Benchmark.start(this.toString() + "<-")
            }
            this._toTarget.setPathIfChanged(this._toPropertyKey, b);
            if (c) {
                SC.Benchmark.start(this.toString() + "<-")
            }
        }
    },
    sync: function() {
        if (!this.isConnected) {
            return this
        }
        if (this._connectionPending) {
            this._syncOnConnect = YES
        } else {
            this._computeBindingTargets();
            var c = this._fromTarget;
            var b = this._fromPropertyKey;
            if (!c || !b) {
                return this
            }
            var a = c.getPath(b);
            if (a !== this._bindingValue) {
                this._setBindingValue(c, b);
                this._changePending = YES;
                SC.Binding._changeQueue.add(this)
            }
        }
        return this
    },
    _syncOnConnect: NO,
    _computeBindingTargets: function() {
        if (!this._fromTarget) {
            var c,
            b,
            a;
            c = this._fromPropertyPath;
            b = this._fromRoot;
            if (SC.typeOf(c) === SC.T_STRING) {
                if (c.indexOf(".") === 0) {
                    c = c.slice(1);
                    if (!b) {
                        b = this._toRoot
                    }
                } else {
                    if (c.indexOf("*") === 0) {
                        c = [b || this._toRoot, c.slice(1)];
                        b = null
                    }
                }
            }
            a = SC.tupleForPropertyPath(c, b);
            if (a) {
                this._fromTarget = a[0];
                this._fromPropertyKey = a[1]
            }
        }
        if (!this._toTarget) {
            c = this._toPropertyPath;
            b = this._toRoot;
            a = SC.tupleForPropertyPath(c, b);
            if (a) {
                this._toTarget = a[0];
                this._toPropertyKey = a[1]
            }
        }
    },
    oneWay: function(c, a) {
        if ((a === undefined) && (SC.typeOf(c) === SC.T_BOOL)) {
            a = c;
            c = null
        }
        var b = this.from(c);
        if (b === SC.Binding) {
            b = b.beget()
        }
        b._oneWay = (a === undefined) ? YES: a;
        return b
    },
    transform: function(b) {
        var c = (this === SC.Binding) ? this.beget() : this;
        var a = c._transforms;
        if (a && (a === c.parentBinding._transform)) {
            a = c._transforms = a.slice()
        }
        if (!a) {
            a = c._transforms = []
        }
        a.push(b);
        return c
    },
    resetTransforms: function() {
        var a = (this === SC.Binding) ? this.beget() : this;
        a._transforms = null;
        return a
    },
    noError: function(c, a) {
        if ((a === undefined) && (SC.typeOf(c) === SC.T_BOOL)) {
            a = c;
            c = null
        }
        var b = this.from(c);
        if (b === SC.Binding) {
            b = b.beget()
        }
        b._noError = (a === undefined) ? YES: a;
        return b
    },
    single: function(b, a) {
        if (a === undefined) {
            a = SC.MULTIPLE_PLACEHOLDER
        }
        return this.from(b).transform(function(e, d) {
            if (e && e.isEnumerable) {
                var c = e.get("length");
                e = (c > 1) ? a: (c <= 0) ? null: e.firstObject()
            }
            return e
        })
    },
    notEmpty: function(b, a) {
        if (a === undefined) {
            a = SC.EMPTY_PLACEHOLDER
        }
        return this.from(b).transform(function(d, c) {
            if (SC.none(d) || (d === "") || (SC.isArray(d) && d.length === 0)) {
                d = a
            }
            return d
        })
    },
    notNull: function(b, a) {
        if (a === undefined) {
            a = SC.EMPTY_PLACEHOLDER
        }
        return this.from(b).transform(function(d, c) {
            if (SC.none(d)) {
                d = a
            }
            return d
        })
    },
    multiple: function(a) {
        return this.from(a).transform(function(b) {
            if (!SC.isArray(b)) {
                b = (b == null) ? [] : [b]
            }
            return b
        })
    },
    bool: function(a) {
        return this.from(a).transform(function(b) {
            var c = SC.typeOf(b);
            if (c === SC.T_ERROR) {
                return b
            }
            return (c == SC.T_ARRAY) ? (b.length > 0) : (b === "") ? NO: !!b
        })
    },
    not: function(a) {
        return this.from(a).transform(function(b) {
            var c = SC.typeOf(b);
            if (c === SC.T_ERROR) {
                return b
            }
            return ! ((c == SC.T_ARRAY) ? (b.length > 0) : (b === "") ? NO: !!b)
        })
    },
    isNull: function(a) {
        return this.from(a).transform(function(b) {
            var c = SC.typeOf(b);
            return (c === SC.T_ERROR) ? b: SC.none(b)
        })
    },
    toString: function() {
        var c = this._fromRoot ? "<%@>:%@".fmt(this._fromRoot, this._fromPropertyPath) : this._fromPropertyPath;
        var b = this._toRoot ? "<%@>:%@".fmt(this._toRoot, this._toPropertyPath) : this._toPropertyPath;
        var a = this._oneWay ? "[oneWay]": "";
        return "SC.Binding%@(%@ -> %@)%@".fmt(SC.guidFor(this), c, b, a)
    }
};
SC.binding = function(b, a) {
    return SC.Binding.from(b, a)
};
SC.Cookie = SC.Object.extend({
    name: null,
    value: "",
    expires: null,
    path: null,
    domain: null,
    secure: NO,
    isCookie: YES,
    destroy: function() {
        this.set("expires", -1);
        this.write();
        arguments.callee.base.apply(this, arguments)
    },
    write: function() {
        var b = this.get("name"),
        i = this.get("value"),
        c = this.get("expires"),
        k = this.get("path"),
        e = this.get("domain"),
        a = this.get("secure");
        var h = "";
        if (c && (SC.typeOf(c) === SC.T_NUMBER || (SC.DateTime && c.get && c.get("milliseconds")) || SC.typeOf(c.toUTCString) === SC.T_FUNCTION)) {
            var d;
            if (SC.typeOf(c) === SC.T_NUMBER) {
                d = new Date();
                d.setTime(d.getTime() + (c * 24 * 60 * 60 * 1000))
            } else {
                if (SC.DateTime && c.get && c.get("milliseconds")) {
                    d = new Date(c.get("milliseconds"))
                } else {
                    if (SC.typeOf(c.toUTCString) === SC.T_FUNCTION) {
                        d = c
                    }
                }
            }
            if (d) {
                h = "; expires=" + d.toUTCString()
            }
        }
        var j = k ? "; path=" + k: "";
        var g = e ? "; domain=" + e: "";
        var f = a ? "; secure": "";
        document.cookie = [b, "=", encodeURIComponent(i), h, j, g, f].join("");
        return this
    }
});
SC.Cookie.mixin({
    find: function(a) {
        if (document.cookie && document.cookie != "") {
            var d = document.cookie.split(";");
            for (var c = 0; c < d.length; c++) {
                var b = String(d[c]).trim();
                if (b.substring(0, a.length + 1) === (a + "=")) {
                    return SC.Cookie.create({
                        name: a,
                        value: decodeURIComponent(b.substring(a.length + 1))
                    })
                }
            }
        }
        return null
    }
});
SC.Error = SC.Object.extend({
    code: -1,
    message: "",
    errorValue: null,
    errorObject: function() {
        return this
    }.property().cacheable(),
    label: null,
    toString: function() {
        return "SC.Error:%@:%@ (%@)".fmt(SC.guidFor(this), this.get("message"), this.get("code"))
    },
    isError: YES
});
SC.Error.desc = function(d, a, e, c) {
    var b = {
        message: d
    };
    if (a !== undefined) {
        b.label = a
    }
    if (c !== undefined) {
        b.code = c
    }
    if (e !== undefined) {
        b.errorValue = e
    }
    return this.create(b)
};
SC.$error = function(b, a, d, e) {
    return SC.Error.desc(b, a, d, e)
};
SC.ok = function(a) {
    return (a !== false) && !(a && a.isError)
};
SC.$ok = SC.ok;
SC.val = function(a) {
    if (a && a.isError) {
        return a.get ? a.get("errorValue") : null
    } else {
        return a
    }
};
SC.$val = SC.val;
SC.Error.HAS_MULTIPLE_VALUES = -100;
sc_require("mixins/enumerable");
sc_require("mixins/observable");
sc_require("mixins/freezable");
sc_require("mixins/copyable");
SC.IndexSet = SC.mixin({},
SC.Enumerable, SC.Observable, SC.Freezable, SC.Copyable, {
    _sc_sliceContent: function(e) {
        if (e.length < 1000) {
            return e.slice()
        }
        var d = 0,
        a = [],
        b = e[0];
        while (b !== 0) {
            a[d] = b;
            d = (b < 0) ? (0 - b) : b;
            b = e[d]
        }
        a[d] = 0;
        this._hint(0, d, a);
        return a
    },
    create: function(c, b) {
        var a = SC.beget(this);
        a.initObservable();
        if (c && c.isIndexSet) {
            a._content = this._sc_sliceContent(c._content);
            a.max = c.max;
            a.length = c.length;
            a.source = c.source
        } else {
            a._content = [0];
            if (c !== undefined) {
                a.add(c, b)
            }
        }
        return a
    },
    isIndexSet: YES,
    HINT_SIZE: 256,
    length: 0,
    max: 0,
    min: function() {
        var a = this._content,
        b = a[0];
        return (b === 0) ? -1: (b > 0) ? 0: Math.abs(b)
    }.property("[]").cacheable(),
    firstObject: function() {
        return (this.get("length") > 0) ? this.get("min") : undefined
    }.property(),
    rangeStartForIndex: function(c) {
        var f = this._content,
        a = this.get("max"),
        b,
        e,
        d;
        if (c >= a) {
            return a
        }
        if (Math.abs(f[c]) > c) {
            return c
        }
        d = c - (c % SC.IndexSet.HINT_SIZE);
        b = f[d];
        if (b < 0 || b > c) {
            b = d
        }
        e = Math.abs(f[b]);
        while (e < c) {
            b = e;
            e = Math.abs(f[b])
        }
        return b
    },
    isEqual: function(c) {
        if (c === this) {
            return YES
        }
        if (!c || !c.isIndexSet || (c.max !== this.max) || (c.length !== this.length)) {
            return NO
        }
        var e = this._content,
        b = c._content,
        d = 0,
        a = e[d];
        do {
            if (b[d] !== a) {
                return NO
            }
            d = Math.abs(a);
            a = e[d]
        }
        while (d !== 0);
        return YES
    },
    indexBefore: function(b) {
        if (b === 0) {
            return - 1
        }
        b--;
        var c = this._content,
        a = this.get("max"),
        d = this.rangeStartForIndex(b);
        if (!c) {
            return null
        }
        while ((d === a) || (c[d] < 0)) {
            if (d === 0) {
                return - 1
            }
            b = d - 1;
            d = this.rangeStartForIndex(b)
        }
        return b
    },
    indexAfter: function(b) {
        var d = this._content,
        a = this.get("max"),
        e,
        c;
        if (!d || (b >= a)) {
            return - 1
        }
        b++;
        e = this.rangeStartForIndex(b);
        c = d[e];
        while (c < 0) {
            if (c === 0) {
                return - 1
            }
            b = e = Math.abs(c);
            c = d[e]
        }
        return b
    },
    contains: function(g, c) {
        var b,
        f,
        a,
        e,
        d;
        if (c === undefined) {
            if (g === null || g === undefined) {
                return NO
            }
            if (typeof g === SC.T_NUMBER) {
                c = 1
            } else {
                if (g && g.isIndexSet) {
                    if (g === this) {
                        return YES
                    }
                    b = g._content;
                    f = 0;
                    a = b[f];
                    while (a !== 0) {
                        if ((a > 0) && !this.contains(f, a - f)) {
                            return NO
                        }
                        f = Math.abs(a);
                        a = b[f]
                    }
                    return YES
                } else {
                    c = g.length;
                    g = g.start
                }
            }
        }
        e = this.rangeStartForIndex(g);
        d = this._content[e];
        return (d > 0) && (e <= g) && (d >= (g + c))
    },
    intersects: function(f, c) {
        var b,
        e,
        a,
        d;
        if (c === undefined) {
            if (typeof f === SC.T_NUMBER) {
                c = 1
            } else {
                if (f && f.isIndexSet) {
                    if (f === this) {
                        return YES
                    }
                    b = f._content;
                    e = 0;
                    a = b[e];
                    while (a !== 0) {
                        if ((a > 0) && this.intersects(e, a - e)) {
                            return YES
                        }
                        e = Math.abs(a);
                        a = b[e]
                    }
                    return NO
                } else {
                    c = f.length;
                    f = f.start
                }
            }
        }
        e = this.rangeStartForIndex(f);
        b = this._content;
        a = b[e];
        d = f + c;
        while (e < d) {
            if (a === 0) {
                return NO
            }
            if ((a > 0) && (a > f)) {
                return YES
            }
            e = Math.abs(a);
            a = b[e]
        }
        return NO
    },
    without: function(b, a) {
        if (b === this) {
            return SC.IndexSet.create()
        }
        return this.clone().remove(b, a)
    },
    replace: function(c, a) {
        if (a === undefined) {
            if (typeof c === SC.T_NUMBER) {
                a = 1
            } else {
                if (c && c.isIndexSet) {
                    this._content = this._sc_sliceContent(c._content);
                    this.beginPropertyChanges().set("max", c.max).set("length", c.length).set("source", c.source).enumerableContentDidChange().endPropertyChanges();
                    return this
                } else {
                    a = c.length;
                    c = c.start
                }
            }
        }
        var b = this.length;
        this._content.length = 1;
        this._content[0] = 0;
        this.length = this.max = 0;
        return this.add(c, a)
    },
    add: function(a, b) {
        if (this.isFrozen) {
            throw SC.FROZEN_ERROR
        }
        var e,
        i,
        d;
        if (a && a.isIndexSet) {
            e = a._content;
            if (!e) {
                return this
            }
            i = 0;
            d = e[0];
            while (d !== 0) {
                if (d > 0) {
                    this.add(i, d - i)
                }
                i = d < 0 ? 0 - d: d;
                d = e[i]
            }
            return this
        } else {
            if (b === undefined) {
                if (a === null || a === undefined) {
                    return this
                } else {
                    if (typeof a === SC.T_NUMBER) {
                        b = 1
                    } else {
                        b = a.length;
                        a = a.start
                    }
                }
            } else {
                if (b === null) {
                    b = 1
                }
            }
        }
        if (b <= 0) {
            return this
        }
        var f = this.get("max"),
        c = f,
        h,
        g;
        e = this._content;
        if (a === f) {
            if (a > 0) {
                i = this.rangeStartForIndex(a - 1);
                d = e[i];
                if (d > 0) {
                    delete e[f];
                    e[i] = f = a + b;
                    a = i
                } else {
                    e[f] = f = a + b
                }
            } else {
                e[a] = f = b
            }
            e[f] = 0;
            this.set("max", f);
            this.set("length", this.length + b);
            b = f - a
        } else {
            if (a > f) {
                e[f] = 0 - a;
                e[a] = a + b;
                e[a + b] = 0;
                this.set("max", a + b);
                this.set("length", this.length + b);
                b = a + b - f;
                a = f
            } else {
                i = this.rangeStartForIndex(a);
                d = e[i];
                f = a + b;
                h = 0;
                if ((a > 0) && (i === a) && (d <= 0)) {
                    i = this.rangeStartForIndex(a - 1);
                    d = e[i]
                }
                if (d < 0) {
                    e[i] = 0 - a;
                    if (Math.abs(d) > f) {
                        e[a] = 0 - f;
                        e[f] = d
                    } else {
                        e[a] = d
                    }
                } else {
                    a = i;
                    if (d > f) {
                        f = d
                    }
                }
                i = a;
                while (i < f) {
                    g = e[i];
                    if (g === 0) {
                        e[f] = 0;
                        d = f;
                        h += f - i
                    } else {
                        d = Math.abs(g);
                        if (d > f) {
                            e[f] = g;
                            d = f
                        }
                        if (g < 0) {
                            h += d - i
                        }
                    }
                    delete e[i];
                    i = d
                }
                if ((i = e[f]) > 0) {
                    delete e[f];
                    f = i
                }
                e[a] = f;
                if (f > c) {
                    this.set("max", f)
                }
                this.set("length", this.get("length") + h);
                b = f - a
            }
        }
        this._hint(a, b);
        if (h !== 0) {
            this.enumerableContentDidChange()
        }
        return this
    },
    remove: function(a, b) {
        if (this.isFrozen) {
            throw SC.FROZEN_ERROR
        }
        if (b === undefined) {
            if (a === null || a === undefined) {
                return this
            } else {
                if (typeof a === SC.T_NUMBER) {
                    b = 1
                } else {
                    if (a.isIndexSet) {
                        a.forEachRange(this.remove, this);
                        return this
                    } else {
                        b = a.length;
                        a = a.start
                    }
                }
            }
        }
        if (b <= 0) {
            return this
        }
        var f = this.get("max"),
        c = f,
        e = this._content,
        j,
        d,
        i,
        g,
        h;
        if (a >= f) {
            return this
        }
        j = this.rangeStartForIndex(a);
        d = e[j];
        h = a + b;
        i = 0;
        if ((a > 0) && (j === a) && (d > 0)) {
            j = this.rangeStartForIndex(a - 1);
            d = e[j]
        }
        if (d > 0) {
            e[j] = a;
            if (d > h) {
                e[a] = h;
                e[h] = d
            } else {
                e[a] = d
            }
        } else {
            a = j;
            d = Math.abs(d);
            if (d > h) {
                h = d
            }
        }
        j = a;
        while (j < h) {
            g = e[j];
            if (g === 0) {
                e[h] = 0;
                d = h
            } else {
                d = Math.abs(g);
                if (d > h) {
                    e[h] = g;
                    d = h
                }
                if (g > 0) {
                    i += d - j
                }
            }
            delete e[j];
            j = d
        }
        if ((j = e[h]) < 0) {
            delete e[h];
            h = Math.abs(j)
        }
        if (e[h] === 0) {
            delete e[h];
            e[a] = 0;
            this.set("max", a)
        } else {
            e[a] = 0 - h
        }
        this.set("length", this.get("length") - i);
        b = h - a;
        this._hint(a, b);
        if (i !== 0) {
            this.enumerableContentDidChange()
        }
        return this
    },
    _hint: function(g, d, c) {
        if (c === undefined) {
            c = this._content
        }
        var b = SC.IndexSet.HINT_SIZE,
        a = Math.abs(c[g]),
        f = g - (g % b) + b,
        e = g + d;
        while (f < e) {
            while ((a !== 0) && (a <= f)) {
                g = a;
                a = Math.abs(c[g])
            }
            if (a === 0) {
                delete c[f]
            } else {
                if (f !== g) {
                    c[f] = g
                }
            }
            f += b
        }
    },
    clear: function() {
        if (this.isFrozen) {
            throw SC.FROZEN_ERROR
        }
        var a = this.length;
        this._content.length = 1;
        this._content[0] = 0;
        this.set("length", 0).set("max", 0);
        if (a > 0) {
            this.enumerableContentDidChange()
        }
    },
    addEach: function(b) {
        if (this.isFrozen) {
            throw SC.FROZEN_ERROR
        }
        this.beginPropertyChanges();
        var a = b.get("length");
        if (b.isSCArray) {
            while (--a >= 0) {
                this.add(b.objectAt(a))
            }
        } else {
            if (b.isEnumerable) {
                b.forEach(function(c) {
                    this.add(c)
                },
                this)
            }
        }
        this.endPropertyChanges();
        return this
    },
    removeEach: function(b) {
        if (this.isFrozen) {
            throw SC.FROZEN_ERROR
        }
        this.beginPropertyChanges();
        var a = b.get("length");
        if (b.isSCArray) {
            while (--a >= 0) {
                this.remove(b.objectAt(a))
            }
        } else {
            if (b.isEnumerable) {
                b.forEach(function(c) {
                    this.remove(c)
                },
                this)
            }
        }
        this.endPropertyChanges();
        return this
    },
    clone: function() {
        return SC.IndexSet.create(this)
    },
    inspect: function() {
        var e = this._content,
        b = e.length,
        a = 0,
        c = [],
        d;
        for (a = 0; a < b; a++) {
            d = e[a];
            if (d !== undefined) {
                c.push("%@:%@".fmt(a, d))
            }
        }
        return "SC.IndexSet<%@>".fmt(c.join(" , "))
    },
    forEachRange: function(f, d) {
        var b = this._content,
        e = 0,
        a = b[e],
        c = this.source;
        if (d === undefined) {
            d = null
        }
        while (a !== 0) {
            if (a > 0) {
                f.call(d, e, a - e, this, c)
            }
            e = Math.abs(a);
            a = b[e]
        }
        return this
    },
    forEachIn: function(b, c, j, f) {
        var g = this._content,
        i = 0,
        h = 0,
        d = b + c,
        a = this.source,
        e = g[i];
        if (f === undefined) {
            f = null
        }
        while (e !== 0) {
            if (i < b) {
                i = b
            }
            while ((i < e) && (i < d)) {
                j.call(f, i++, h++, this, a)
            }
            if (i >= d) {
                i = e = 0
            } else {
                i = Math.abs(e);
                e = g[i]
            }
        }
        return this
    },
    lengthIn: function(g, d) {
        var a = 0;
        if (d === undefined) {
            if (g === null || g === undefined) {
                return 0
            } else {
                if (typeof g === SC.T_NUMBER) {
                    d = 1
                } else {
                    if (g.isIndexSet) {
                        g.forEachRange(function(i, h) {
                            a += this.lengthIn(i, h)
                        },
                        this);
                        return a
                    } else {
                        d = g.length;
                        g = g.start
                    }
                }
            }
        }
        if (this.get("length") === 0) {
            return 0
        }
        var c = this._content,
        f = 0,
        b = c[f],
        e = g + d;
        while (f < e && b !== 0) {
            if (b > 0) {
                a += (b > e) ? e - f: b - f
            }
            f = Math.abs(b);
            b = c[f]
        }
        return a
    },
    source: null,
    indexOf: function(d, c) {
        var f = this.source;
        if (!f) {
            throw "%@.indexOf() requires source".fmt(this)
        }
        var b = f.get("length"),
        e = this._content,
        g = e[0] < 0 ? Math.abs(e[0]) : 0,
        a;
        while (g >= 0 && g < b) {
            a = f.indexOf(d, g);
            if (a < 0) {
                return - 1
            }
            if (this.contains(a)) {
                return a
            }
            g = a + 1
        }
        return - 1
    },
    lastIndexOf: function(d, c) {
        var e = this.source;
        if (!e) {
            throw "%@.lastIndexOf() requires source".fmt(this)
        }
        var b = e.get("length"),
        f = this.max - 1,
        a;
        if (f >= b) {
            f = b - 1
        }
        while (f >= 0) {
            a = e.lastIndexOf(d, f);
            if (a < 0) {
                return - 1
            }
            if (this.contains(a)) {
                return a
            }
            f = a + 1
        }
        return - 1
    },
    forEachObject: function(g, e) {
        var d = this.source;
        if (!d) {
            throw "%@.forEachObject() requires source".fmt(this)
        }
        var c = this._content,
        f = 0,
        a = 0,
        b = c[f];
        if (e === undefined) {
            e = null
        }
        while (b !== 0) {
            while (f < b) {
                g.call(e, d.objectAt(f), f, d, this);
                f++
            }
            f = Math.abs(b);
            b = c[f]
        }
        return this
    },
    addObject: function(c, d) {
        var e = this.source;
        if (!e) {
            throw "%@.addObject() requires source".fmt(this)
        }
        var b = e.get("length"),
        f = 0,
        a;
        while (f >= 0 && f < b) {
            a = e.indexOf(c, f);
            if (a >= 0) {
                this.add(a);
                if (d) {
                    return this
                }
                f = a++
            } else {
                return this
            }
        }
        return this
    },
    addObjects: function(b, a) {
        b.forEach(function(c) {
            this.addObject(c, a)
        },
        this);
        return this
    },
    removeObject: function(c, d) {
        var e = this.source;
        if (!e) {
            throw "%@.removeObject() requires source".fmt(this)
        }
        var b = e.get("length"),
        f = 0,
        a;
        while (f >= 0 && f < b) {
            a = e.indexOf(c, f);
            if (a >= 0) {
                this.remove(a);
                if (d) {
                    return this
                }
                f = a + 1
            } else {
                return this
            }
        }
        return this
    },
    removeObjects: function(b, a) {
        b.forEach(function(c) {
            this.removeObject(c, a)
        },
        this);
        return this
    },
    LOG_OBSERVING: NO,
    forEach: function(g, e) {
        var c = this._content,
        f = 0,
        a = 0,
        d = this.source,
        b = c[f];
        if (e === undefined) {
            e = null
        }
        while (b !== 0) {
            while (f < b) {
                g.call(e, f++, a++, this, d)
            }
            f = Math.abs(b);
            b = c[f]
        }
        return this
    },
    nextObject: function(f, b, c) {
        var e = this._content,
        d = c.next,
        a = this.get("max");
        if (b === null) {
            b = d = 0
        } else {
            if (b >= a) {
                delete c.next;
                return null
            } else {
                b++
            }
        }
        if (b === d) {
            do {
                b = Math.abs(d);
                d = e[b]
            }
            while (d < 0);
            c.next = d
        }
        return b
    },
    toString: function() {
        var a = [];
        this.forEachRange(function(c, b) {
            a.push(b === 1 ? c: "%@..%@".fmt(c, c + b - 1))
        },
        this);
        return "SC.IndexSet<%@>".fmt(a.join(","))
    },
    max: 0
});
SC.IndexSet.slice = SC.IndexSet.copy = SC.IndexSet.clone;
SC.IndexSet.EMPTY = SC.IndexSet.create().freeze();
SC.LOGGER_LOG_DELIMITER = ", ";
SC.LOGGER_LOG_ERROR = "ERROR: ";
SC.LOGGER_LOG_INFO = "INFO: ";
SC.LOGGER_LOG_WARN = "WARNING: ";
SC.Logger = SC.Object.create({
    exists: function() {
        return typeof(this.get("reporter")) !== "undefined" && this.get("reporter") != null
    }.property("reporter").cacheable(),
    fallBackOnAlert: NO,
    fallBackOnLog: YES,
    format: YES,
    reporter: SC.console,
    log: function() {
        var a = this.get("reporter");
        if (this.get("exists") && typeof(a.log) === "function") {
            if (this.get("format")) {
                a.log(this._argumentsToString.apply(this, arguments))
            } else {
                a.log.apply(a, arguments)
            }
            return true
        } else {
            if (this.fallBackOnAlert) {
                var b = this.get("format") ? this._argumentsToString.apply(this, arguments) : arguments;
                if (this.get("exists") && typeof(a.alert) === "function") {
                    a.alert(b)
                } else {
                    alert(b)
                }
                return true
            }
        }
        return false
    },
    dir: function() {
        var a = this.get("reporter");
        if (this.get("exists") && typeof(a.dir) === "function") {
            a.dir.apply(a, arguments);
            return true
        }
        return (this.fallBackOnLog) ? this.log.apply(this, arguments) : false
    },
    dirxml: function() {
        var a = this.get("reporter");
        if (this.get("exists") && typeof(a.dirxml) === "function") {
            a.dirxml.apply(a, arguments);
            return true
        }
        return (this.fallBackOnLog) ? this.log.apply(this, arguments) : false
    },
    error: function() {
        var c = this.get("reporter");
        if (this.get("exists") && typeof(c.error) === "function") {
            c.error.apply(c, arguments);
            return true
        } else {
            if (this.fallBackOnLog) {
                var b = this._argumentsToArray(arguments);
                if (typeof(b.unshift) === "function") {
                    b.unshift(SC.LOGGER_LOG_ERROR)
                }
                return this.log.apply(this, b)
            }
        }
        return false
    },
    group: function(b) {
        var a = this.get("reporter");
        if (this.get("exists") && typeof(a.group) === "function") {
            a.group(b);
            return true
        }
        return false
    },
    groupEnd: function() {
        var a = this.get("reporter");
        if (this.get("exists") && typeof(a.groupEnd) === "function") {
            a.groupEnd();
            return true
        }
        return false
    },
    info: function() {
        var c = this.get("reporter");
        if (this.get("exists") && typeof(c.info) === "function") {
            c.info.apply(c, arguments);
            return true
        } else {
            if (this.fallBackOnLog) {
                var b = this._argumentsToArray(arguments);
                if (typeof(b.unshift) === "function") {
                    b.unshift(SC.LOGGER_LOG_INFO)
                }
                return this.log.apply(this, b)
            }
        }
        return false
    },
    profile: function() {
        var a = this.get("reporter");
        if (this.get("exists") && typeof(a.profile) === "function") {
            a.profile();
            return true
        }
        return false
    },
    profileEnd: function() {
        var a = this.get("reporter");
        if (this.get("exists") && typeof(a.profileEnd) === "function") {
            a.profileEnd();
            return true
        }
        return false
    },
    time: function(b) {
        var a = this.get("reporter");
        if (this.get("exists") && typeof(a.time) === "function") {
            a.time(b);
            return true
        }
        return false
    },
    timeEnd: function(b) {
        var a = this.get("reporter");
        if (this.get("exists") && typeof(a.timeEnd) === "function") {
            a.timeEnd(b);
            return true
        }
        return false
    },
    trace: function() {
        var a = this.get("reporter");
        if (this.get("exists") && typeof(a.trace) === "function") {
            a.trace();
            return true
        }
        return false
    },
    warn: function() {
        var c = this.get("reporter");
        if (this.get("exists") && typeof(c.warn) === "function") {
            c.warn.apply(c, arguments);
            return true
        } else {
            if (this.fallBackOnLog) {
                var b = this._argumentsToArray(arguments);
                if (typeof(b.unshift) === "function") {
                    b.unshift(SC.LOGGER_LOG_WARN)
                }
                return this.log.apply(this, b)
            }
        }
        return false
    },
    _argumentsToArray: function(d) {
        if (!d) {
            return []
        }
        var b = [];
        for (var c = 0; c < d.length; c++) {
            b[c] = d[c]
        }
        return b
    },
    _argumentsToString: function() {
        var b = "";
        for (var a = 0; a < arguments.length - 1; a++) {
            b += arguments[a] + SC.LOGGER_LOG_DELIMITER
        }
        b += arguments[arguments.length - 1];
        return b
    }
});
sc_require("private/observer_set");
SC.RunLoop = SC.Object.extend({
    beginRunLoop: function() {
        this._start = new Date().getTime();
        if (SC.LOG_BINDINGS || SC.LOG_OBSERVERS) {
            console.log("-- SC.RunLoop.beginRunLoop at %@".fmt(this._start))
        }
        return this
    },
    endRunLoop: function() {
        var a;
        if (SC.LOG_BINDINGS || SC.LOG_OBSERVERS) {
            console.log("-- SC.RunLoop.endRunLoop ~ flushing application queues")
        }
        do {
            a = this.flushApplicationQueues();
            if (!a) {
                a = this._flushinvokeLastQueue()
            }
        }
        while (a);
        this._start = null;
        if (SC.LOG_BINDINGS || SC.LOG_OBSERVERS) {
            console.log("-- SC.RunLoop.endRunLoop ~ End")
        }
        return this
    },
    invokeOnce: function(a, b) {
        if (b === undefined) {
            b = a;
            a = this
        }
        if (SC.typeOf(b) === SC.T_STRING) {
            b = a[b]
        }
        if (!this._invokeQueue) {
            this._invokeQueue = SC.ObserverSet.create()
        }
        this._invokeQueue.add(a, b);
        return this
    },
    invokeLast: function(a, b) {
        if (b === undefined) {
            b = a;
            a = this
        }
        if (SC.typeOf(b) === SC.T_STRING) {
            b = a[b]
        }
        if (!this._invokeLastQueue) {
            this._invokeLastQueue = SC.ObserverSet.create()
        }
        this._invokeLastQueue.add(a, b);
        return this
    },
    flushApplicationQueues: function() {
        var b = NO;
        var a = this._invokeQueue;
        if (a && a.targets > 0) {
            this._invokeQueue = null;
            b = YES;
            a.invokeMethods()
        }
        return SC.Binding.flushPendingChanges() || b
    },
    _flushinvokeLastQueue: function() {
        var a = this._invokeLastQueue,
        b = NO;
        if (a && a.targets > 0) {
            this._invokeLastQueue = null;
            b = YES;
            if (b) {
                a.invokeMethods()
            }
        }
        return b
    }
});
SC.RunLoop.currentRunLoop = null;
SC.RunLoop.runLoopClass = SC.RunLoop;
SC.RunLoop.begin = function() {
    var a = this.currentRunLoop;
    if (!a) {
        a = this.currentRunLoop = this.runLoopClass.create()
    }
    a.beginRunLoop();
    return this
};
SC.RunLoop.end = function() {
    var a = this.currentRunLoop;
    if (!a) {
        throw "SC.RunLoop.end() called outside of a runloop!"
    }
    a.endRunLoop();
    return this
};
SC.run = function(b, a) {
    SC.RunLoop.begin();
    b.call(a);
    SC.RunLoop.end()
};
sc_require("system/object");
sc_require("mixins/enumerable");
sc_require("mixins/copyable");
sc_require("mixins/freezable");
SC.SelectionSet = SC.Object.extend(SC.Enumerable, SC.Freezable, SC.Copyable, {
    isSelectionSet: YES,
    length: function() {
        var a = 0,
        b = this._sets,
        c = this._objects;
        if (c) {
            a += c.get("length")
        }
        if (b) {
            b.forEach(function(d) {
                a += d.get("length")
            })
        }
        return a
    }.property().cacheable(),
    sources: function() {
        var c = [],
        d = this._sets,
        b = d ? d.length: 0,
        a,
        f,
        e;
        for (a = 0; a < b; a++) {
            f = d[a];
            if (f && f.get("length") > 0 && f.source) {
                c.push(f.source)
            }
        }
        return c
    }.property().cacheable(),
    indexSetForSource: function(e) {
        if (!e || !e.isSCArray) {
            return null
        }
        var b = this._indexSetCache,
        d = this._objects,
        c,
        a;
        if (!b) {
            b = this._indexSetCache = {}
        }
        c = b[SC.guidFor(e)];
        if (c && c._sourceRevision && (c._sourceRevision !== e.propertyRevision)) {
            c = null
        }
        if (!c) {
            c = this._indexSetForSource(e, NO);
            if (c && c.get("length") === 0) {
                c = null
            }
            if (d) {
                if (c) {
                    c = c.copy()
                }
                d.forEach(function(f) {
                    if ((a = e.indexOf(f)) >= 0) {
                        if (!c) {
                            c = SC.IndexSet.create()
                        }
                        c.add(a)
                    }
                },
                this)
            }
            if (c) {
                c = b[SC.guidFor(e)] = c.frozenCopy();
                c._sourceRevision = e.propertyRevision
            }
        }
        return c
    },
    _indexSetForSource: function(f, g) {
        if (g === undefined) {
            g = YES
        }
        var d = SC.guidFor(f),
        c = this[d],
        e = this._sets,
        a = e ? e.length: 0,
        b = null;
        if (c >= a) {
            c = null
        }
        if (SC.none(c)) {
            if (g && !this.isFrozen) {
                this.propertyWillChange("sources");
                if (!e) {
                    e = this._sets = []
                }
                b = e[a] = SC.IndexSet.create();
                b.source = f;
                this[d] = a;
                this.propertyDidChange("sources")
            }
        } else {
            b = e ? e[c] : null
        }
        return b
    },
    add: function(a, b, d) {
        if (this.isFrozen) {
            throw SC.FROZEN_ERROR
        }
        var g,
        f,
        j,
        i,
        c,
        e,
        h,
        k;
        if (b === undefined && d === undefined) {
            if (!a) {
                throw "Must pass params to SC.SelectionSet.add()"
            }
            if (a.isIndexSet) {
                return this.add(a.source, a)
            }
            if (a.isSelectionSet) {
                g = a._sets;
                k = a._objects;
                f = g ? g.length: 0;
                this.beginPropertyChanges();
                for (j = 0; j < f; j++) {
                    i = g[j];
                    if (i && i.get("length") > 0) {
                        this.add(i.source, i)
                    }
                }
                if (k) {
                    this.addObjects(k)
                }
                this.endPropertyChanges();
                return this
            }
        }
        i = this._indexSetForSource(a, YES);
        c = this.get("length");
        h = i.get("length");
        e = c - h;
        i.add(b, d);
        this._indexSetCache = null;
        e += i.get("length");
        if (e !== c) {
            this.propertyDidChange("length");
            this.enumerableContentDidChange();
            if (h === 0) {
                this.notifyPropertyChange("sources")
            }
        }
        return this
    },
    remove: function(a, b, d) {
        if (this.isFrozen) {
            throw SC.FROZEN_ERROR
        }
        var g,
        f,
        j,
        i,
        c,
        e,
        h,
        k;
        if (b === undefined && d === undefined) {
            if (!a) {
                throw "Must pass params to SC.SelectionSet.remove()"
            }
            if (a.isIndexSet) {
                return this.remove(a.source, a)
            }
            if (a.isSelectionSet) {
                g = a._sets;
                k = a._objects;
                f = g ? g.length: 0;
                this.beginPropertyChanges();
                for (j = 0; j < f; j++) {
                    i = g[j];
                    if (i && i.get("length") > 0) {
                        this.remove(i.source, i)
                    }
                }
                if (k) {
                    this.removeObjects(k)
                }
                this.endPropertyChanges();
                return this
            }
        }
        i = this._indexSetForSource(a, YES);
        c = this.get("length");
        e = c - i.get("length");
        if (i && (k = this._objects)) {
            if (d !== undefined) {
                b = SC.IndexSet.create(b, d);
                d = undefined
            }
            k.forEach(function(l) {
                j = a.indexOf(l);
                if (b.contains(j)) {
                    k.remove(l);
                    e--
                }
            },
            this)
        }
        i.remove(b, d);
        h = i.get("length");
        e += h;
        this._indexSetCache = null;
        if (e !== c) {
            this.propertyDidChange("length");
            this.enumerableContentDidChange();
            if (h === 0) {
                this.notifyPropertyChange("sources")
            }
        }
        return this
    },
    contains: function(b, d, a) {
        if (d === undefined && a === undefined) {
            return this.containsObject(b)
        }
        var c = this.indexSetForSource(b);
        if (!c) {
            return NO
        }
        return c.contains(d, a)
    },
    intersects: function(b, d, a) {
        var c = this.indexSetForSource(b, NO);
        if (!c) {
            return NO
        }
        return c.intersects(d, a)
    },
    _TMP_ARY: [],
    addObject: function(b) {
        var c = this._TMP_ARY,
        a;
        c[0] = b;
        a = this.addObjects(c);
        c.length = 0;
        return a
    },
    addObjects: function(a) {
        var d = this._objects,
        b,
        c;
        if (!d) {
            d = this._objects = SC.CoreSet.create()
        }
        b = d.get("length");
        d.addEach(a);
        c = d.get("length");
        this._indexSetCache = null;
        if (c !== b) {
            this.propertyDidChange("length");
            this.enumerableContentDidChange()
        }
        return this
    },
    removeObject: function(b) {
        var c = this._TMP_ARY,
        a;
        c[0] = b;
        a = this.removeObjects(c);
        c.length = 0;
        return a
    },
    removeObjects: function(b) {
        var e = this._objects,
        c,
        d,
        a;
        if (!e) {
            return this
        }
        c = e.get("length");
        e.removeEach(b);
        d = e.get("length");
        if (a = this._sets) {
            a.forEach(function(f) {
                c += f.get("length");
                f.removeObjects(b);
                d += f.get("length")
            },
            this)
        }
        this._indexSetCache = null;
        if (d !== c) {
            this.propertyDidChange("length");
            this.enumerableContentDidChange()
        }
        return this
    },
    containsObject: function(c) {
        var e = this._objects;
        if (e && e.contains(c)) {
            return YES
        }
        var d = this._sets,
        b = d ? d.length: 0,
        a,
        f;
        for (a = 0; a < b; a++) {
            f = d[a];
            if (f && f.indexOf(c) >= 0) {
                return YES
            }
        }
        return NO
    },
    constrain: function(d) {
        var e,
        b,
        a,
        c;
        this.beginPropertyChanges();
        this.get("sources").forEach(function(f) {
            if (f === d) {
                return
            }
            var g = this._indexSetForSource(d, NO);
            if (g) {
                this.remove(d, g)
            }
        },
        this);
        e = this._indexSetForSource(d, NO);
        if (e && ((a = e.get("max")) > (b = d.get("length")))) {
            this.remove(d, b, a - b)
        }
        if (c = this._objects) {
            c.forEach(function(f) {
                if (d.indexOf(f) < 0) {
                    this.removeObject(f)
                }
            },
            this)
        }
        this.endPropertyChanges();
        return this
    },
    isEqual: function(g) {
        var f,
        d,
        b,
        a,
        c,
        e;
        if (!g || !g.isSelectionSet) {
            return NO
        }
        if (g === this) {
            return YES
        }
        if ((this._sets === g._sets) && (this._objects === g._objects)) {
            return YES
        }
        if (this.get("length") !== g.get("length")) {
            return NO
        }
        f = this._objects;
        d = g._objects;
        if (f || d) {
            if ((f ? f.get("length") : 0) !== (d ? d.get("length") : 0)) {
                return NO
            }
            if (f && !f.isEqual(d)) {
                return NO
            }
        }
        c = this.get("sources");
        a = c.get("length");
        for (b = 0; b < a; b++) {
            e = c.objectAt(b);
            f = this._indexSetForSource(e, NO);
            d = this._indexSetForSource(e, NO);
            if ( !! d !== !!f) {
                return NO
            }
            if (f && !f.isEqual(d)) {
                return NO
            }
        }
        return YES
    },
    clear: function() {
        if (this.isFrozen) {
            throw SC.FROZEN_ERROR
        }
        if (this._sets) {
            this._sets.length = 0
        }
        if (this._objects) {
            this._objects = null
        }
        this._indexSetCache = null;
        this.propertyDidChange("length");
        this.enumerableContentDidChange();
        this.notifyPropertyChange("sources");
        return this
    },
    copy: function() {
        var c = this.constructor.create(),
        d = this._sets,
        b = d ? d.length: 0,
        a,
        e;
        if (d && b > 0) {
            d = c._sets = d.slice();
            for (a = 0; a < b; a++) {
                if (! (e = d[a])) {
                    continue
                }
                e = d[a] = e.copy();
                c[SC.guidFor(e.source)] = a
            }
        }
        if (this._objects) {
            c._objects = this._objects.copy()
        }
        return c
    },
    freeze: function() {
        if (this.isFrozen) {
            return this
        }
        var a = this._sets,
        b = a ? a.length: 0,
        c;
        while (--b >= 0) {
            if (c = a[b]) {
                c.freeze()
            }
        }
        if (this._objects) {
            this._objects.freeze()
        }
        return arguments.callee.base.apply(this, arguments)
    },
    toString: function() {
        var a = this._sets || [];
        a = a.map(function(b) {
            return b.toString().replace("SC.IndexSet", SC.guidFor(b.source))
        },
        this);
        if (this._objects) {
            a.push(this._objects.toString())
        }
        return "SC.SelectionSet:%@<%@>".fmt(SC.guidFor(this), a.join(","))
    },
    firstObject: function() {
        var b = this._sets,
        c = this._objects;
        if (b && b.get("length") > 0) {
            var e = b ? b[0] : null,
            d = e ? e.source: null,
            a = e ? e.firstObject() : -1;
            if (d && a >= 0) {
                return d.objectAt(a)
            }
        }
        return c ? c.firstObject() : undefined
    }.property(),
    nextObject: function(c, e, b) {
        var d,
        a;
        if (c === 0) {
            d = b.objects = [];
            this.forEach(function(f) {
                d.push(f)
            },
            this);
            b.max = d.length
        }
        d = b.objects;
        a = d[c];
        if (c + 1 >= b.max) {
            b.objects = b.max = null
        }
        return a
    },
    forEach: function(g, e) {
        var c = this._sets,
        d = this._objects,
        b = c ? c.length: 0,
        f,
        a;
        for (a = 0; a < b; a++) {
            f = c[a];
            if (f) {
                f.forEachObject(g, e)
            }
        }
        if (d) {
            d.forEach(g, e)
        }
        return this
    }
});
SC.SelectionSet.prototype.clone = SC.SelectionSet.prototype.copy;
SC.SelectionSet.EMPTY = SC.SelectionSet.create().freeze();
sc_require("mixins/enumerable");
sc_require("mixins/array");
sc_require("mixins/observable");
sc_require("mixins/delegate_support");
SC.SparseArray = SC.Object.extend(SC.Observable, SC.Enumerable, SC.Array, SC.DelegateSupport, {
    _requestingLength: 0,
    _requestingIndex: 0,
    length: function() {
        var a = this.delegate;
        if (a && SC.none(this._length) && a.sparseArrayDidRequestLength) {
            this._requestingLength++;
            a.sparseArrayDidRequestLength(this);
            this._requestingLength--
        }
        return this._length || 0
    }.property().cacheable(),
    provideLength: function(a) {
        if (SC.none(a)) {
            this._sa_content = null
        }
        if (a !== this._length) {
            this._length = a;
            if (this._requestingLength <= 0) {
                this.enumerableContentDidChange()
            }
        }
        return this
    },
    rangeWindowSize: 1,
    requestedRangeIndex: [],
    objectAt: function(a) {
        var c = this._sa_content,
        b;
        if (!c) {
            c = this._sa_content = []
        }
        if ((b = c[a]) === undefined) {
            this.requestIndex(a);
            b = c[a]
        }
        return b
    },
    definedIndexes: function(d) {
        var c = SC.IndexSet.create(),
        e = this._sa_content,
        b,
        a;
        if (!e) {
            return c.freeze()
        }
        if (d) {
            d.forEach(function(f) {
                if (e[f] !== undefined) {
                    c.add(f)
                }
            })
        } else {
            a = e.length;
            for (b = 0; b < a; b++) {
                if (e[b] !== undefined) {
                    c.add(b)
                }
            }
        }
        return c.freeze()
    },
    _TMP_RANGE: {},
    requestIndex: function(b) {
        var c = this.delegate;
        if (!c) {
            return this
        }
        var a = this.get("rangeWindowSize"),
        e = b;
        if (a > 1) {
            e = e - Math.floor(e % a)
        }
        if (a < 1) {
            a = 1
        }
        this._requestingIndex++;
        if (c.sparseArrayDidRequestRange) {
            var d = this._TMP_RANGE;
            if (this.wasRangeRequested(e) === -1) {
                d.start = e;
                d.length = a;
                c.sparseArrayDidRequestRange(this, d);
                this.requestedRangeIndex.push(e)
            }
        } else {
            if (c.sparseArrayDidRequestIndex) {
                while (--a >= 0) {
                    c.sparseArrayDidRequestIndex(this, e + a)
                }
            }
        }
        this._requestingIndex--;
        return this
    },
    wasRangeRequested: function(c) {
        var b,
        a;
        for (b = 0, a = this.requestedRangeIndex.length;
        b < a; b++) {
            if (this.requestedRangeIndex[b] === c) {
                return b
            }
        }
        return - 1
    },
    rangeRequestCompleted: function(b) {
        var a = this.wasRangeRequested(b);
        if (a >= 0) {
            this.requestedRangeIndex.removeAt(a, 1);
            return YES
        }
        return NO
    },
    provideObjectsInRange: function(b, e) {
        var c = this._sa_content;
        if (!c) {
            c = this._sa_content = []
        }
        var d = b.start,
        a = b.length;
        while (--a >= 0) {
            c[d + a] = e[a]
        }
        if (this._requestingIndex <= 0) {
            this.enumerableContentDidChange()
        }
        return this
    },
    _TMP_PROVIDE_ARRAY: [],
    _TMP_PROVIDE_RANGE: {
        length: 1
    },
    provideObjectAtIndex: function(c, b) {
        var d = this._TMP_PROVIDE_ARRAY,
        a = this._TMP_PROVIDE_RANGE;
        d[0] = b;
        a.start = c;
        return this.provideObjectsInRange(a, d)
    },
    objectsDidChangeInRange: function(a) {
        var b = this._sa_content;
        if (b) {
            if (a.start === 0 && SC.maxRange(a) >= b.length) {
                this._sa_content = null
            } else {
                var d = a.start,
                c = Math.min(d + a.length, b.length);
                while (--c >= d) {
                    b[c] = undefined
                }
            }
        }
        this.enumerableContentDidChange(a);
        return this
    },
    indexOf: function(c) {
        var a = this.delegate;
        if (a && a.sparseArrayDidRequestIndexOf) {
            return a.sparseArrayDidRequestIndexOf(this, c)
        } else {
            var b = this._sa_content;
            if (!b) {
                b = this._sa_content = []
            }
            return b.indexOf(c)
        }
    },
    replace: function(b, g, e) {
        e = e || [];
        var c = this.delegate;
        if (c) {
            if (!c.sparseArrayShouldReplace || !c.sparseArrayShouldReplace(this, b, g, e)) {
                return this
            }
        }
        var d = this._sa_content;
        if (!d) {
            d = this._sa_content = []
        }
        d.replace(b, g, e);
        var a = e ? (e.get ? e.get("length") : e.length) : 0;
        var f = a - g;
        if (!SC.none(this._length)) {
            this.propertyWillChange("length");
            this._length += f;
            this.propertyDidChange("length")
        }
        this.enumerableContentDidChange(b, g, f);
        return this
    },
    reset: function() {
        this._sa_content = null;
        this._length = null;
        this.enumerableContentDidChange();
        this.invokeDelegateMethod(this.delegate, "sparseArrayDidReset", this);
        return this
    }
});
SC.SparseArray.array = function(a) {
    return this.create({
        _length: a || 0
    })
};
if ((typeof SC !== "undefined") && SC && SC.bundleDidLoad) {
    SC.bundleDidLoad("sproutcore/runtime")
};
// RUNTIME.JS END


//DATA STORE AS WELL
// DATASTORE.JS START
/* >>>>>>>>>> BEGIN source/core.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

// Place any global constants here

/* >>>>>>>>>> BEGIN source/data_sources/data_source.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/** @class

  TODO: Describe
  
  @extend SC.Object
  @since SproutCore 1.0
*/
SC.DataSource = SC.Object.extend( /** @scope SC.DataSource.prototype */ {

  // ..........................................................
  // SC.STORE ENTRY POINTS
  // 
  

  /**
  
    Invoked by the store whenever it needs to retrieve data matching a 
    specific query, triggered by find().  This method is called anytime
    you invoke SC.Store#find() with a query or SC.RecordArray#refresh().  You 
    should override this method to actually retrieve data from the server 
    needed to fulfill the query.  If the query is a remote query, then you 
    will also need to provide the contents of the query as well.
    
    h3. Handling Local Queries
    
    Most queries you create in your application will be local queries.  Local
    queries are populated automatically from whatever data you have in memory.
    When your fetch() method is called on a local queries, all you need to do
    is load any records that might be matched by the query into memory. 
    
    The way you choose which queries to fetch is up to you, though usually it
    can be something fairly straightforward such as loading all records of a
    specified type.
    
    When you finish loading any data that might be required for your query, 
    you should always call SC.Store#dataSourceDidFetchQuery() to put the query 
    back into the READY state.  You should call this method even if you choose
    not to load any new data into the store in order to notify that the store
    that you think it is ready to return results for the query.
    
    h3. Handling Remote Queries
    
    Remote queries are special queries whose results will be populated by the
    server instead of from memory.  Usually you will only need to use this 
    type of query when loading large amounts of data from the server.
    
    Like Local queries, to fetch a remote query you will need to load any data
    you need to fetch from the server and add the records to the store.  Once
    you are finished loading this data, however, you must also call
    SC.Store#loadQueryResults() to actually set an array of storeKeys that
    represent the latest results from the server.  This will implicitly also
    call datasSourceDidFetchQuery() so you don't need to call this method 
    yourself.
    
    If you want to support incremental loading from the server for remote 
    queries, you can do so by passing a SC.SparseArray instance instead of 
    a regular array of storeKeys and then populate the sparse array on demand.
    
    h3. Handling Errors and Cancelations
    
    If you encounter an error while trying to fetch the results for a query 
    you can call SC.Store#dataSourceDidErrorQuery() instead.  This will put
    the query results into an error state.  
    
    If you had to cancel fetching a query before the results were returned, 
    you can instead call SC.Store#dataSourceDidCancelQuery().  This will set 
    the query back into the state it was in previously before it started 
    loading the query.
    
    h3. Return Values
    
    When you return from this method, be sure to return a Boolean.  YES means
    you handled the query, NO means you can't handle the query.  When using
    a cascading data source, returning NO will mean the next data source will
    be asked to fetch the same results as well.
    
    @param {SC.Store} store the requesting store
    @param {SC.Query} query query describing the request
    @returns {Boolean} YES if you can handle fetching the query, NO otherwise
  */
  fetch: function(store, query) {
    return NO ; // do not handle anything!
  },
  
  /**
    Called by the store whenever it needs to load a specific set of store 
    keys.  The default implementation will call retrieveRecord() for each
    storeKey.  
    
    You should implement either retrieveRecord() or retrieveRecords() to 
    actually fetch the records referenced by the storeKeys .
    
    @param {SC.Store} store the requesting store
    @param {Array} storeKeys
    @param {Array} ids - optional
    @returns {Boolean} YES if handled, NO otherwise
  */
  retrieveRecords: function(store, storeKeys, ids) {
    return this._handleEach(store, storeKeys, this.retrieveRecord, ids);  
  },
  
  /**
    Invoked by the store whenever it has one or more records with pending 
    changes that need to be sent back to the server.  The store keys will be
    separated into three categories:
    
     - createStoreKeys: records that need to be created on server
     - updateStoreKeys: existing records that have been modified
     - destroyStoreKeys: records need to be destroyed on the server
     
    If you do not override this method yourself, this method will actually
    invoke createRecords(), updateRecords(), and destroyRecords() on the 
    dataSource, passing each array of storeKeys.  You can usually implement
    those methods instead of overriding this method.
    
    However, if your server API can sync multiple changes at once, you may
    prefer to override this method instead.
    
    To support cascading data stores, be sure to return NO if you cannot 
    handle any of the keys, YES if you can handle all of the keys, or
    SC.MIXED_STATE if you can handle some of them.

    @param {SC.Store} store the requesting store
    @param {Array} createStoreKeys keys to create
    @param {Array} updateStoreKeys keys to update
    @param {Array} destroyStoreKeys keys to destroy
    @param {Hash} params to be passed down to data source. originated
      from the commitRecords() call on the store
    @returns {Boolean} YES if data source can handle keys
  */
  commitRecords: function(store, createStoreKeys, updateStoreKeys, destroyStoreKeys, params) {
    var cret, uret, dret;
    if (createStoreKeys.length>0) {
      cret = this.createRecords.call(this, store, createStoreKeys, params);
    }
        
    if (updateStoreKeys.length>0) {
      uret = this.updateRecords.call(this, store, updateStoreKeys, params); 
    }
       
    if (destroyStoreKeys.length>0) {
      dret = this.destroyRecords.call(this, store, destroyStoreKeys, params);
    }
     
    return ((cret === uret) && (cret === dret)) ? cret : SC.MIXED_STATE;
  },
  
  /**
    Invoked by the store whenever it needs to cancel one or more records that
    are currently in-flight.  If any of the storeKeys match records you are
    currently acting upon, you should cancel the in-progress operation and 
    return YES.
    
    If you implement an in-memory data source that immediately services the
    other requests, then this method will never be called on your data source.
    
    To support cascading data stores, be sure to return NO if you cannot 
    retrieve any of the keys, YES if you can retrieve all of the, or
    SC.MIXED_STATE if you can retrieve some of the.
    
    @param {SC.Store} store the requesting store
    @param {Array} storeKeys array of storeKeys to retrieve
    @returns {Boolean} YES if data source can handle keys
  */
  cancel: function(store, storeKeys) {
    return NO;
  },
  
  // ..........................................................
  // BULK RECORD ACTIONS
  // 
  
  /**
    Called from commitRecords() to commit modified existing records to the 
    store.  You can override this method to actually send the updated 
    records to your store.  The default version will simply call 
    updateRecord() for each storeKey.

    To support cascading data stores, be sure to return NO if you cannot 
    handle any of the keys, YES if you can handle all of the keys, or
    SC.MIXED_STATE if you can handle some of them.

    @param {SC.Store} store the requesting store
    @param {Array} storeKeys keys to update
    @param {Hash} params 
      to be passed down to data source. originated from the commitRecords() 
      call on the store

    @returns {Boolean} YES, NO, or SC.MIXED_STATE  

  */
  updateRecords: function(store, storeKeys, params) {
    return this._handleEach(store, storeKeys, this.updateRecord, null, params);
  },
  
  /**
    Called from commitRecords() to commit newly created records to the 
    store.  You can override this method to actually send the created 
    records to your store.  The default version will simply call 
    createRecord() for each storeKey.

    To support cascading data stores, be sure to return NO if you cannot 
    handle any of the keys, YES if you can handle all of the keys, or
    SC.MIXED_STATE if you can handle some of them.

    @param {SC.Store} store the requesting store
    @param {Array} storeKeys keys to update
    
    @param {Hash} params 
      to be passed down to data source. originated from the commitRecords() 
      call on the store
    
    @returns {Boolean} YES, NO, or SC.MIXED_STATE  
  
  */
  createRecords: function(store, storeKeys, params) {
    return this._handleEach(store, storeKeys, this.createRecord, null, params);
  },

  /**
    Called from commitRecords() to commit destroted records to the 
    store.  You can override this method to actually send the destroyed 
    records to your store.  The default version will simply call 
    destroyRecord() for each storeKey.

    To support cascading data stores, be sure to return NO if you cannot 
    handle any of the keys, YES if you can handle all of the keys, or
    SC.MIXED_STATE if you can handle some of them.

    @param {SC.Store} store the requesting store
    @param {Array} storeKeys keys to update
    @param {Hash} params to be passed down to data source. originated
      from the commitRecords() call on the store

    @returns {Boolean} YES, NO, or SC.MIXED_STATE  

  */
  destroyRecords: function(store, storeKeys, params) {
    return this._handleEach(store, storeKeys, this.destroyRecord, null, params);
  },

  /** @private
    invokes the named action for each store key.  returns proper value
  */
  _handleEach: function(store, storeKeys, action, ids, params) {
    var len = storeKeys.length, idx, ret, cur, lastArg;
    if(!ids) ids = [];
    
    for(idx=0;idx<len;idx++) {
      lastArg = ids[idx] ? ids[idx] : params;
      
      cur = action.call(this, store, storeKeys[idx], lastArg, params);
      if (ret === undefined) {
        ret = cur ;
      } else if (ret === YES) {
        ret = (cur === YES) ? YES : SC.MIXED_STATE ;
      } else if (ret === NO) {
        ret = (cur === NO) ? NO : SC.MIXED_STATE ;
      }
    }
    return ret ? ret : null ;
  },
  

  // ..........................................................
  // SINGLE RECORD ACTIONS
  // 
  
  /**
    Called from updatesRecords() to update a single record.  This is the 
    most basic primitive to can implement to support updating a record.
    
    To support cascading data stores, be sure to return NO if you cannot 
    handle the passed storeKey or YES if you can.
    
    @param {SC.Store} store the requesting store
    @param {Array} storeKey key to update
    @param {Hash} params to be passed down to data source. originated
      from the commitRecords() call on the store
    @returns {Boolean} YES if handled
  */
  updateRecord: function(store, storeKey, params) {
    return NO ;
  },

  /**
    Called from retrieveRecords() to retrieve a single record.
    
    @param {SC.Store} store the requesting store
    @param {Array} storeKey key to retrieve
    @param {String} id the id to retrieve
    @returns {Boolean} YES if handled
  */
  retrieveRecord: function(store, storeKey, id) {
    return NO ;
  },

  /**
    Called from createdRecords() to created a single record.  This is the 
    most basic primitive to can implement to support creating a record.
    
    To support cascading data stores, be sure to return NO if you cannot 
    handle the passed storeKey or YES if you can.
    
    @param {SC.Store} store the requesting store
    @param {Array} storeKey key to update
    @param {Hash} params to be passed down to data source. originated
      from the commitRecords() call on the store
    @returns {Boolean} YES if handled
  */
  createRecord: function(store, storeKey, params) {
    return NO ;
  },

  /**
    Called from destroyRecords() to destroy a single record.  This is the 
    most basic primitive to can implement to support destroying a record.
    
    To support cascading data stores, be sure to return NO if you cannot 
    handle the passed storeKey or YES if you can.
    
    @param {SC.Store} store the requesting store
    @param {Array} storeKey key to update
    @param {Hash} params to be passed down to data source. originated
      from the commitRecords() call on the store
    @returns {Boolean} YES if handled
  */
  destroyRecord: function(store, storeKey, params) {
    return NO ;
  }  
    
});

/* >>>>>>>>>> BEGIN source/data_sources/cascade.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

sc_require('data_sources/data_source');

/** @class

  A cascading data source will actually forward requests onto an array of 
  additional data sources, stopping when one of the data sources returns YES,
  indicating that it handled the request.  
  
  You can use a cascading data source to tie together multiple data sources,
  treating them as a single namespace.
  
  h2. Configuring a Cascade Data Source
  
  You will usually define your cascading data source in your main method after
  all the classes you have are loaded.
  
  {{{
    MyApp.dataSource = SC.CascadeDataSource.create({
      dataSources: "prefs youtube photos".w(),
      
      prefs:   MyApp.PrefsDataSource.create({ root: "/prefs" }),
      youtube: YouTube.YouTubeDataSource.create({ apiKey: "123456" }),
      photos:  MyApp.PhotosDataSource.create({ root: "photos" })
      
    });
    
    MyApp.store.set('dataSource', MyApp.dataSource);
  }}}
  
  Note that the order you define your dataSources property will determine the
  order in which requests will cascade from the store.
  
  Alternatively, you can use a more jQuery-like API for defining your data
  sources:
  
  {{{
    MyApp.dataSource = SC.CascadeDataSource.create()
      .from(MyApp.PrefsDataSource.create({ root: "/prefs" }))
      .from(YouTube.YouTubeDataSource.create({ apiKey: "123456" }))
      .from(MyApp.PhotosDataSource.create({ root: "photos" }));

    MyApp.store.set('dataSource', MyApp.dataSource);
  }}}

  In this case, the order you call from() will determine the order the request
  will cascade.
  
  @extends SC.DataSource
  @since SproutCore 1.0
*/
SC.CascadeDataSource = SC.DataSource.extend( 
  /** @scope SC.CascadeDataSource.prototype */ {

  /**
    The data sources used by the cascade, in the order that they are to be 
    followed.  Usually when you define the cascade, you will define this
    array.
    
    @property {Array}
  */
  dataSources: null,

  /**
    Add a data source to the list of sources to use when cascading.  Used to
    build the data source cascade effect.

    @param {SC.DataSource} dataSource a data source instance to add.
    @returns {SC.CascadeDataSource} receiver
  */
  from: function(dataSource) {
    var dataSources = this.get('dataSources');
    if (!dataSources) this.set('dataSources', dataSources = []);
    dataSources.push(dataSource);
    return this ;
  },
    
  // ..........................................................
  // SC.STORE ENTRY POINTS
  // 
  
  /** @private - just cascades */
  fetch: function(store, query) {
    var sources = this.get('dataSources'), 
        len     = sources ? sources.length : 0,
        ret     = NO,
        cur, source, idx;
    
    for(idx=0; (ret !== YES) && idx<len; idx++) {
      source = sources.objectAt(idx);
      cur = source.fetch ? source.fetch.call(source, store, query) : NO;
      ret = this._handleResponse(ret, cur);
    }
    
    return ret ;
  },
  
  
  /** @private - just cascades */
  retrieveRecords: function(store, storeKeys) {
    var sources = this.get('dataSources'), 
        len     = sources ? sources.length : 0,
        ret     = NO,
        cur, source, idx;
    
    for(idx=0; (ret !== YES) && idx<len; idx++) {
      source = sources.objectAt(idx);
      cur = source.retrieveRecords.call(source, store, storeKeys);
      ret = this._handleResponse(ret, cur);
    }
    
    return ret ;
  },

  /** @private - just cascades */
  commitRecords: function(store, createStoreKeys, updateStoreKeys, destroyStoreKeys) {
    var sources = this.get('dataSources'), 
        len     = sources ? sources.length : 0,
        ret     = NO,
        cur, source, idx;
    
    for(idx=0; (ret !== YES) && idx<len; idx++) {
      source = sources.objectAt(idx);
      cur = source.commitRecords.call(source, store, createStoreKeys, updateStoreKeys, destroyStoreKeys);
      ret = this._handleResponse(ret, cur);
    }
    
    return ret ;
  },

  /** @private - just cascades */
  cancel: function(store, storeKeys) {
    var sources = this.get('dataSources'), 
        len     = sources ? sources.length : 0,
        ret     = NO,
        cur, source, idx;
    
    for(idx=0; (ret !== YES) && idx<len; idx++) {
      source = sources.objectAt(idx);
      cur = source.cancel.call(source, store, storeKeys);
      ret = this._handleResponse(ret, cur);
    }
    
    return ret ;
  },
  
  // ..........................................................
  // INTERNAL SUPPORT
  // 
  
  /** @private */
  init: function() {
    arguments.callee.base.apply(this,arguments);
    
    // if a dataSources array is defined, look for any strings and lookup 
    // the same on the data source.  Replace.
    var sources = this.get('dataSources'),
        idx     = sources ? sources.get('length') : 0,
        source;
    while(--idx>=0) {
      source = sources[idx];
      if (SC.typeOf(source) === SC.T_STRING) sources[idx] = this.get(source);
    }
    
  },

  /** @private - Determine the proper return value. */
  _handleResponse: function(current, response) {
    if (response === YES) return YES ;
    else if (current === NO) return (response === NO) ? NO : SC.MIXED_STATE ;
    else return SC.MIXED_STATE ;
  }
    
});

/* >>>>>>>>>> BEGIN source/models/record.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/**
  @class

  A Record is the core model class in SproutCore. It is analogous to 
  NSManagedObject in Core Data and EOEnterpriseObject in the Enterprise
  Objects Framework (aka WebObjects), or ActiveRecord::Base in Rails.
  
  To create a new model class, in your SproutCore workspace, do:
  
  {{{
    $ sc-gen model MyApp.MyModel
  }}}
  
  This will create MyApp.MyModel in clients/my_app/models/my_model.js.
  
  The core attributes hash is used to store the values of a record in a 
  format that can be easily passed to/from the server.  The values should 
  generally be stored in their raw string form.  References to external 
  records should be stored as primary keys.
  
  Normally you do not need to work with the attributes hash directly.  
  Instead you should use get/set on normal record properties.  If the 
  property is not defined on the object, then the record will check the 
  attributes hash instead.
  
  You can bulk update attributes from the server using the 
  updateAttributes() method.

  @extends SC.Object
  @since SproutCore 1.0
*/
SC.Record = SC.Object.extend(
/** @scope SC.Record.prototype */ {
  
  /**  
    Walk like a duck
  
    @property {Boolean}
  */
  isRecord: YES,
  
  // ...............................
  // PROPERTIES
  //
  
  /**
    This is the primary key used to distinguish records.  If the keys
    match, the records are assumed to be identical.
    
    @property {String}
  */
  primaryKey: 'guid',
  
  /**
    Returns the id for the record instance.  The id is used to uniquely 
    identify this record instance from all others of the same type.  If you 
    have a primaryKey set on this class, then the id will be the value of the
    primaryKey property on the underlying JSON hash.
    
    @property {String}
  */
  id: function(key, value) {
    if (value !== undefined) {
      this.writeAttribute(this.get('primaryKey'), value);
      return value;
    } else {
      return SC.Store.idFor(this.storeKey);
    }
  }.property('storeKey').cacheable(),
  
  /**
    All records generally have a life cycle as they are created or loaded into 
    memory, modified, committed and finally destroyed.  This life cycle is 
    managed by the status property on your record. 

    The status of a record is modelled as a finite state machine.  Based on the 
    current state of the record, you can determine which operations are 
    currently allowed on the record and which are not.
    
    In general, a record can be in one of five primary states; SC.Record.EMPTY,
    SC.Record.BUSY, SC.Record.READY, SC.Record.DESTROYED, SC.Record.ERROR. 
    These are all described in more detail in the class mixin (below) where 
    they are defined.
    
    @property {Number}
  */
  status: function() {
    return this.store.readStatus(this.storeKey);
  }.property('storeKey').cacheable(),

  /**
    The store that owns this record.  All changes will be buffered into this
    store and committed to the rest of the store chain through here.
    
    This property is set when the record instance is created and should not be
    changed or else it will break the record behavior.
    
    @property {SC.Store}
  */
  store: null,

  /**
    This is the store key for the record, it is used to link it back to the 
    dataHash. If a record is reused, this value will be replaced.
    
    You should not edit this store key but you may sometimes need to refer to
    this store key when implementing a Server object.
    
    @property {Number}
  */
  storeKey: null,

  /** 
    YES when the record has been destroyed
    
    @property {Boolean}
  */
  isDestroyed: function() {
    return !!(this.get('status') & SC.Record.DESTROYED);  
  }.property('status').cacheable(),
  
  /**
    YES when the record is in an editable state.  You can use this property to
    quickly determine whether attempting to modify the record would raise an 
    exception or not.
    
    This property is both readable and writable.  Note however that if you 
    set this property to YES but the status of the record is anything but
    SC.Record.READY, the return value of this property may remain NO.
    
    @property {Boolean}
  */
  isEditable: function(key, value) {
    if (value !== undefined) this._screc_isEditable = value;
    if (this.get('status') & SC.Record.READY) return this._screc_isEditable;
    else return NO ;
  }.property('status').cacheable(),
  
  _screc_isEditable: YES, // default
  
  /**
    YES when the record's contents have been loaded for the first time.  You 
    can use this to quickly determine if the record is ready to display.
    
    @property {Boolean}
  */
  isLoaded: function() {
    var K = SC.Record, 
        status = this.get('status');
    return !((status===K.EMPTY) || (status===K.BUSY_LOADING) || (status===K.ERROR));
  }.property('status').cacheable(),
  
  /**
    If set, this should be an array of active relationship objects that need
    to be notified whenever the underlying record properties change.  
    Currently this is only used by toMany relationships, but you could 
    possibly patch into this yourself also if you are building your own 
    relationships.
    
    Note this must be a regular Array - NOT any object implmenting SC.Array.
    
    @property {Array}
  */
  relationships: null,

  /**
    This will return the raw attributes that you can edit directly.  If you 
    make changes to this hash, be sure to call beginEditing() before you get
    the attributes and endEditing() afterwards.
  
    @property {Hash}
  **/
  attributes: function() {
    var store    = this.get('store'), 
        storeKey = this.storeKey;
    return store.readEditableDataHash(storeKey);
  }.property(),
    
  // ...............................
  // CRUD OPERATIONS
  //

  /**
    Refresh the record from the persistent store.  If the record was loaded 
    from a persistent store, then the store will be asked to reload the 
    record data from the server.  If the record is new and exists only in 
    memory then this call will have no effect.
    
    @returns {SC.Record} receiver
  */
  refresh: function() { 
    this.get('store').refreshRecord(null, null, this.get('storeKey'));
    return this ;
  },
  
  /**
    Deletes the record along with any dependent records.  This will mark the 
    records destroyed in the store as well as changing the isDestroyed 
    property on the record to YES.  If this is a new record, this will avoid 
    creating the record in the first place.
    
    @returns {SC.Record} receiver
  */
  destroy: function() { 
    this.get('store').destroyRecord(null, null, this.get('storeKey'));
    this.propertyDidChange('status');
    return this ;
  },

  /**
    You can invoke this method anytime you need to make the record as dirty.
    This will cause the record to be commited when you commitChanges()
    on the underlying store.
    
    If you use the writeAttribute() primitive, this method will be called for 
    you.
    
    If you pass the key that changed it will ensure that observers are fired
    only once for the changed property instead of allPropertiesDidChange()
    
    @param {String} key that changed (optional)
    @returns {SC.Record} receiver
  */
  recordDidChange: function(key) {
    this.get('store').recordDidChange(null, null, this.get('storeKey'), key);
    this.notifyPropertyChange('status');
    return this ;
  },
  
  // ...............................
  // ATTRIBUTES
  //

  /** @private
    Current edit level.  Used to defer editing changes. 
  */
  _editLevel: 0 ,
  
  /**
    Defers notification of record changes until you call a matching 
    endEditing() method.  This method is called automatically whenever you
    set an attribute, but you can call it yourself to group multiple changes.
    
    Calls to beginEditing() and endEditing() can be nested.
    
    @returns {SC.Record} receiver
  */
  beginEditing: function() {
    this._editLevel++;
    return this ;
  },

  /**
    Notifies the store of record changes if this matches a top level call to
    beginEditing().  This method is called automatically whenever you set an
    attribute, but you can call it yourself to group multiple changes.
    
    Calls to beginEditing() and endEditing() can be nested.
    
    @param {String} key that changed (optional)
    @returns {SC.Record} receiver
  */
  endEditing: function(key) {
    if(--this._editLevel <= 0) {
      this._editLevel = 0; 
      this.recordDidChange(key);
    }
    return this ;
  },
  
  /**
    Reads the raw attribute from the underlying data hash.  This method does
    not transform the underlying attribute at all.
  
    @param {String} key the attribute you want to read
    @returns {Object} the value of the key, or null if it doesn't exist
  */
  readAttribute: function(key) {
    var store = this.get('store'), storeKey = this.storeKey;
    var attrs = store.readDataHash(storeKey);
    return attrs ? attrs[key] : undefined ; 
  },

  /**
    Updates the passed attribute with the new value.  This method does not 
    transform the value at all.  If instead you want to modify an array or 
    hash already defined on the underlying json, you should instead get 
    an editable version of the attribute using editableAttribute()
  
    @param {String} key the attribute you want to read
    @param {Object} value the value you want to write
    @param {Boolean} ignoreDidChange only set if you do NOT want to flag 
      record as dirty
    @returns {SC.Record} receiver
  */
  writeAttribute: function(key, value, ignoreDidChange) {
    var store    = this.get('store'), 
        storeKey = this.storeKey,
        status   = store.peekStatus(storeKey),
        recordAttr = this[key],
        recordType = SC.Store.recordTypeFor(storeKey),
        attrs;
    
    attrs = store.readEditableDataHash(storeKey);
    if (!attrs) throw SC.Record.BAD_STATE_ERROR;

    // if value is the same, do not flag record as dirty
    if (value !== attrs[key]) {
      if(!ignoreDidChange) this.beginEditing();
      attrs[key] = value;
      if(!ignoreDidChange) this.endEditing(key);
    }
    
    // if value is primaryKey of record, write it to idsByStoreKey
    if (key===this.get('primaryKey')) {
      SC.Store.idsByStoreKey[storeKey] = attrs[key] ;
      this.propertyDidChange('id'); // Reset computed value
    }
    
    // if any aggregates, propagate the state
    if(!recordType.aggregates || recordType.aggregates.length>0) {
      this.propagateToAggregates();
    }
    
    return this ;  
  },
  
  /**
    This will also ensure that any aggregate records are also marked dirty
    if this record changes.
    
    Should not have to be called manually.
  */
  propagateToAggregates: function() {
    var storeKey = this.get('storeKey'),
        recordType = SC.Store.recordTypeFor(storeKey), 
        idx, len, key, val, recs;
    
    var aggregates = recordType.aggregates;
    
    // if recordType aggregates are not set up yet, make sure to 
    // create the cache first
    if(!aggregates) {
      var dataHash = this.get('store').readDataHash(storeKey),
          aggregates = [];
      for(k in dataHash) {
        if(this[k] && this[k].get && this[k].get('aggregate')===YES) {
          aggregates.push(k);
        }
      }
      recordType.aggregates = aggregates;
    }
    
    // now loop through all aggregate properties and mark their related
    // record objects as dirty
    for(idx=0,len=aggregates.length;idx<len;idx++) {
      key = aggregates[idx];
      val = this.get(key);
      
      recs = SC.kindOf(val, SC.ManyArray) ? val : [val];
      recs.forEach(function(rec) {
        // write the dirty status
        if(rec) { 
          rec.get('store').writeStatus(rec.get('storeKey'), this.get('status'));
          rec.storeDidChangeProperties(YES);
        }
      }, this);
    }
    
  },
  
  /**
    Called by the store whenever the underlying data hash has changed.  This
    will notify any observers interested in data hash properties that they
    have changed.
    
    @param {Boolean} statusOnly changed
    @param {String} key that changed (optional)
    @returns {SC.Record} receiver
  */
  storeDidChangeProperties: function(statusOnly, keys) {
    if (statusOnly) this.notifyPropertyChange('status');
    else {      
      if (keys) {
        this.beginPropertyChanges();
        keys.forEach(function(k) { this.notifyPropertyChange(k); }, this);
        this.notifyPropertyChange('status'); 
        this.endPropertyChanges();
        
      } else this.allPropertiesDidChange(); 
    
      // also notify manyArrays
      var manyArrays = this.relationships,
          loc        = manyArrays ? manyArrays.length : 0 ;
      while(--loc>=0) manyArrays[loc].recordPropertyDidChange(keys);
    }
  },
  
  /**
    Normalizing a record will ensure that the underlying hash conforms
    to the record attributes such as their types (transforms) and default 
    values. 
    
    This method will write the conforming hash to the store and return
    the materialized record.
    
    By normalizing the record, you can use .attributes() and be
    assured that it will conform to the defined model. For example, this
    can be useful in the case where you need to send a JSON representation
    to some server after you have used .createRecord(), since this method
    will enforce the 'rules' in the model such as their types and default
    values. You can also include null values in the hash with the 
    includeNull argument.
    
    @param {Boolean} includeNull will write empty (null) attributes
    @returns {SC.Record} the normalized record
  */
  
  normalize: function(includeNull) {
    
    var primaryKey = this.primaryKey, 
        dataHash   = {}, 
        recordId   = this.get('id'), 
        store      = this.get('store'), 
        storeKey   = this.get('storeKey'), 
        recHash, attrValue, isRecord, defaultVal;
    
    dataHash[primaryKey] = recordId;
    
    for(var key in this) {
      // make sure property is a record attribute.
      if(this[key] && this[key]['typeClass']) {
        
        isRecord = SC.typeOf(this[key].typeClass())==='class';

        if (!isRecord) {
          attrValue = this.get(key);
          if(attrValue!==undefined || (attrValue===null && includeNull)) {
            dataHash[key] = attrValue;
          }
        }
        else if(isRecord) {
          recHash = store.readDataHash(storeKey);

          if(recHash[key]!==undefined) {
            // write value already there
            dataHash[key] = recHash[key];

          // or write default
          } else {
            defaultVal = this[key].get('defaultValue');

            // computed default value
            if (SC.typeOf(defaultVal)===SC.T_FUNCTION) {
              dataHash[key] = defaultVal();
            
            // plain value
            } else {
              dataHash[key] = defaultVal;
            }
          }
        }
      }
    }
    
    store.writeDataHash(storeKey, dataHash);
    return store.materializeRecord(storeKey);
  },
  
  /**
    If you try to get/set a property not defined by the record, then this 
    method will be called. It will try to get the value from the set of 
    attributes.
    
    This will also check is ignoreUnknownProperties is set on the recordType
    so that they will not be written to dataHash unless explicitly defined
    in the model schema.
  
    @param {String} key the attribute being get/set
    @param {Object} value the value to set the key to, if present
    @returns {Object} the value
  */
  unknownProperty: function(key, value) {
    
    if (value !== undefined) {
      
      // first check if we should ignore unknown properties for this 
      // recordType
      var storeKey = this.get('storeKey'),
        recordType = SC.Store.recordTypeFor(storeKey);
      
      if(recordType.ignoreUnknownProperties===YES) {
        this[key] = value;
        return value;
      }
      
      // if we're modifying the PKEY, then SC.Store needs to relocate where 
      // this record is cached. store the old key, update the value, then let 
      // the store do the housekeeping...
      var primaryKey = this.get('primaryKey');
      this.writeAttribute(key,value);

      // update ID if needed
      if (key === primaryKey) {
        SC.Store.replaceIdFor(storeKey, value);
      }
      
    }
    return this.readAttribute(key);
  },
  
  /**
    Lets you commit this specific record to the store which will trigger
    the appropriate methods in the data source for you.
    
    @param {Hash} params optional additonal params that will passed down
      to the data source
    @returns {SC.Record} receiver
  */
  commitRecord: function(params) {
    var store = this.get('store');
    store.commitRecord(undefined, undefined, this.get('storeKey'), params);
    return this ;
  },
  
  // ..........................................................
  // EMULATE SC.ERROR API
  // 
  
  /**
    Returns YES whenever the status is SC.Record.ERROR.  This will allow you 
    to put the UI into an error state.
    
    @property {Boolean}
  */
  isError: function() {
    return this.get('status') & SC.Record.ERROR;
  }.property('status').cacheable(),

  /**
    Returns the receiver if the record is in an error state.  Returns null
    otherwise.
    
    @property {SC.Record}
  */
  errorValue: function() {
    return this.get('isError') ? SC.val(this.get('errorObject')) : null ;
  }.property('isError').cacheable(),
  
  /**
    Returns the current error object only if the record is in an error state.
    If no explicit error object has been set, returns SC.Record.GENERIC_ERROR.
    
    @property {SC.Error}
  */
  errorObject: function() {
    if (this.get('isError')) {
      var store = this.get('store');
      return store.readError(this.get('storeKey')) || SC.Record.GENERIC_ERROR;
    } else return null ;
  }.property('isError').cacheable(),
  
  // ...............................
  // PRIVATE
  //
  
  /** @private
    Creates string representation of record, with status.
    
    @returns {String}
  */
  
  toString: function() {
    var attrs = this.get('attributes');
    return "%@(%@) %@".fmt(this.constructor.toString(), SC.inspect(attrs), this.statusString());
  },
  
  /** @private
    Creates string representation of record, with status.
    
    @returns {String}
  */
  
  statusString: function() {
    var ret = [], status = this.get('status');
    
    for(var prop in SC.Record) {
      if(prop.match(/[A-Z_]$/) && SC.Record[prop]===status) {
        ret.push(prop);
      }
    }
    
    return ret.join(" ");
  }
      
}) ;

// Class Methods
SC.Record.mixin( /** @scope SC.Record */ {

  /**
    Whether to ignore unknown properties when they are being set on the record
    object. This is useful if you want to strictly enforce the model schema
    and not allow dynamically expanding it by setting new unknown properties
    
    @property {Boolean}
  */
  ignoreUnknownProperties: NO,

  // ..........................................................
  // CONSTANTS
  // 

  /** 
    Generic state for records with no local changes.
    
    Use a logical AND (single &) to test record status
  
    @property {Number}
  */
  CLEAN:            0x0001, // 1

  /** 
    Generic state for records with local changes.
    
    Use a logical AND (single &) to test record status
  
    @property {Number}
  */
  DIRTY:            0x0002, // 2
  
  /** 
    State for records that are still loaded.  
    
    A record instance should never be in this state.  You will only run into 
    it when working with the low-level data hash API on SC.Store. Use a 
    logical AND (single &) to test record status
  
    @property {Number}
  */
  EMPTY:            0x0100, // 256

  /** 
    State for records in an error state.
    
    Use a logical AND (single &) to test record status
  
    @property {Number}
  */
  ERROR:            0x1000, // 4096
  
  /** 
    Generic state for records that are loaded and ready for use
    
    Use a logical AND (single &) to test record status
  
    @property {Number}
  */
  READY:            0x0200, // 512

  /** 
    State for records that are loaded and ready for use with no local changes
    
    Use a logical AND (single &) to test record status
  
    @property {Number}
  */
  READY_CLEAN:      0x0201, // 513


  /** 
    State for records that are loaded and ready for use with local changes
    
    Use a logical AND (single &) to test record status
  
    @property {Number}
  */
  READY_DIRTY:      0x0202, // 514


  /** 
    State for records that are new - not yet committed to server
    
    Use a logical AND (single &) to test record status
  
    @property {Number}
  */
  READY_NEW:        0x0203, // 515
  

  /** 
    Generic state for records that have been destroyed
    
    Use a logical AND (single &) to test record status
  
    @property {Number}
  */
  DESTROYED:        0x0400, // 1024


  /** 
    State for records that have been destroyed and committed to server
    
    Use a logical AND (single &) to test record status
  
    @property {Number}
  */
  DESTROYED_CLEAN:  0x0401, // 1025


  /** 
    State for records that have been destroyed but not yet committed to server
    
    Use a logical AND (single &) to test record status
  
    @property {Number}
  */
  DESTROYED_DIRTY:  0x0402, // 1026
  

  /** 
    Generic state for records that have been submitted to data source
    
    Use a logical AND (single &) to test record status
  
    @property {Number}
  */
  BUSY:             0x0800, // 2048


  /** 
    State for records that are still loading data from the server
    
    Use a logical AND (single &) to test record status
  
    @property {Number}
  */
  BUSY_LOADING:     0x0804, // 2052


  /** 
    State for new records that were created and submitted to the server; 
    waiting on response from server
    
    Use a logical AND (single &) to test record status
  
    @property {Number}
  */
  BUSY_CREATING:    0x0808, // 2056


  /** 
    State for records that have been modified and submitted to server
    
    Use a logical AND (single &) to test record status
  
    @property {Number}
  */
  BUSY_COMMITTING:  0x0810, // 2064


  /** 
    State for records that have requested a refresh from the server.
    
    Use a logical AND (single &) to test record status.
  
    @property {Number}
  */
  BUSY_REFRESH:     0x0820, // 2080


  /** 
    State for records that have requested a refresh from the server.
    
    Use a logical AND (single &) to test record status
  
    @property {Number}
  */
  BUSY_REFRESH_CLEAN:  0x0821, // 2081

  /** 
    State for records that have requested a refresh from the server.
    
    Use a logical AND (single &) to test record status
  
    @property {Number}
  */
  BUSY_REFRESH_DIRTY:  0x0822, // 2082

  /** 
    State for records that have been destroyed and submitted to server
    
    Use a logical AND (single &) to test record status
  
    @property {Number}
  */
  BUSY_DESTROYING:  0x0840, // 2112


  // ..........................................................
  // ERRORS
  // 
  
  /**
    Error for when you try to modify a record while it is in a bad 
    state.
    
    @property {SC.Error}
  */
  BAD_STATE_ERROR:     SC.$error("Internal Inconsistency"),

  /**
    Error for when you try to create a new record that already exists.
    
    @property {SC.Error}
  */
  RECORD_EXISTS_ERROR: SC.$error("Record Exists"),

  /**
    Error for when you attempt to locate a record that is not found
    
    @property {SC.Error}
  */
  NOT_FOUND_ERROR:     SC.$error("Not found "),

  /**
    Error for when you try to modify a record that is currently busy
    
    @property {SC.Error}
  */
  BUSY_ERROR:          SC.$error("Busy"),

  /**
    Generic unknown record error
    
    @property {SC.Error}
  */
  GENERIC_ERROR:       SC.$error("Generic Error"),
  
  // ..........................................................
  // CLASS METHODS
  // 
  
  /**
    Helper method returns a new SC.RecordAttribute instance to map a simple
    value or to-one relationship.  At the very least, you should pass the 
    type class you expect the attribute to have.  You may pass any additional
    options as well.
    
    Use this helper when you define SC.Record subclasses. 
    
    h4. Example
    
    {{{
      MyApp.Contact = SC.Record.extend({
        firstName: SC.Record.attr(String, { isRequired: YES })
      });
    }}}
    
    @param {Class} type the attribute type
    @param {Hash} opts the options for the attribute
    @returns {SC.RecordAttribute} created instance
  */
  attr: function(type, opts) { 
    return SC.RecordAttribute.attr(type, opts); 
  },
  
  /**
    Returns an SC.RecordAttribute that describes a fetched attribute.  When 
    you reference this attribute, it will return an SC.RecordArray that uses
    the type as the fetch key and passes the attribute value as a param.
    
    Use this helper when you define SC.Record subclasses. 
    
    h4. Example
    
    {{{
      MyApp.Group = SC.Record.extend({
        contacts: SC.Record.fetch('MyApp.Contact')
      });
    }}}
    
    @param {SC.Record|String} recordType The type of records to load
    @param {Hash} opts the options for the attribute
    @returns {SC.RecordAttribute} created instance
  */
  fetch: function(recordType, opts) {
    return SC.FetchedAttribute.attr(recordType, opts) ;
  },
  
  /**
    Returns an SC.ManyAttribute that describes a record array backed by an 
    array of guids stored in the underlying JSON.  You can edit the contents
    of this relationship.
    
    If you set the inverse and isMaster: NO key, then editing this array will
    modify the underlying data, but the inverse key on the matching record
    will also be edited and that record will be marked as needing a change.
    
    @param {SC.Record|String} recordType The type of record to create
    @param {Hash} opts the options for the attribute
    @returns {SC.ManyAttribute} created instance
  */
  toMany: function(recordType, opts) {
    return SC.ManyAttribute.attr(recordType, opts);
  },
  
  /**
    Returns a SC.SingleAttribute that converts the underlying ID to a single
    record.  If you modify this property, it will rewrite the underyling ID. 
    It will also modify the inverse of the relationship, if you set it.
    
    @param {SC.Record|String} recordType the type of the record to create
    @param {Hash} opts additional options
    @returns {SC.SingleAttribute} created instance
  */
  toOne: function(recordType, opts) {
    return SC.SingleAttribute.attr(recordType, opts);
  },
    
  /**
    Returns all storeKeys mapped by Id for this record type.  This method is
    used mostly by the SC.Store and the Record to coordinate.  You will rarely
    need to call this method yourself.
    
    @returns {Hash}
  */
  storeKeysById: function() {
    var key = SC.keyFor('storeKey', SC.guidFor(this)),
        ret = this[key];
    if (!ret) ret = this[key] = {};
    return ret;
  },
  
  /**
    Given a primaryKey value for the record, returns the associated
    storeKey.  If the primaryKey has not been assigned a storeKey yet, it 
    will be added.
    
    For the inverse of this method see SC.Store.idFor() and 
    SC.Store.recordTypeFor().
    
    @param {String} id a record id
    @returns {Number} a storeKey.
  */
  storeKeyFor: function(id) {
    var storeKeys = this.storeKeysById(),
        ret       = storeKeys[id];
    
    if (!ret) {
      ret = SC.Store.generateStoreKey();
      SC.Store.idsByStoreKey[ret] = id ;
      SC.Store.recordTypesByStoreKey[ret] = this ;
      storeKeys[id] = ret ;
    }
    
    return ret ;
  },
  
  /**
    Given a primaryKey value for the record, returns the associated
    storeKey.  As opposed to storeKeyFor() however, this method
    will NOT generate a new storeKey but returned undefined.
    
    @param {String} id a record id
    @returns {Number} a storeKey.
  */
  storeKeyExists: function(id) {
    var storeKeys = this.storeKeysById(),
        ret       = storeKeys[id];
    
    return ret ;
  },

  /** 
    Returns a record with the named ID in store.
    
    @param {SC.Store} store the store
    @param {String} id the record id or a query
    @returns {SC.Record} record instance
  */
  find: function(store, id) {
    return store.find(this, id);
  },
  
  /** @private - enhance extend to notify SC.Query as well. */
  extend: function() {
    var ret = SC.Object.extend.apply(this, arguments);
    SC.Query._scq_didDefineRecordType(ret);
    return ret ;
  }
  
}) ;

/* >>>>>>>>>> BEGIN source/data_sources/fixtures.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

sc_require('data_sources/data_source');
sc_require('models/record');

/** @class

  TODO: Describe Class
  
  @extends SC.DataSource
  @since SproutCore 1.0
*/
SC.FixturesDataSource = SC.DataSource.extend(
  /** @scope SC.FixturesDataSource.prototype */ {

  /**
    If YES then the data source will asyncronously respond to data requests
    from the server.  If you plan to replace the fixture data source with a 
    data source that talks to a real remote server (using Ajax for example),
    you should leave this property set to YES so that Fixtures source will
    more accurately simulate your remote data source.

    If you plan to replace this data source with something that works with 
    local storage, for example, then you should set this property to NO to 
    accurately simulate the behavior of your actual data source.
    
    @property {Boolean}
  */
  simulateRemoteResponse: NO,
  
  /**
    If you set simulateRemoteResponse to YES, then the fixtures soure will
    assume a response latency from your server equal to the msec specified
    here.  You should tune this to simulate latency based on the expected 
    performance of your server network.  Here are some good guidelines:
    
    - 500: Simulates a basic server written in PHP, Ruby, or Python (not twisted) without a CDN in front for caching.
    - 250: (Default) simulates the average latency needed to go back to your origin server from anywhere in the world.  assumes your servers itself will respond to requests < 50 msec
    - 100: simulates the latency to a "nearby" server (i.e. same part of the world).  Suitable for simulating locally hosted servers or servers with multiple data centers around the world.
    - 50: simulates the latency to an edge cache node when using a CDN.  Life is really good if you can afford this kind of setup.
    
    @property {Number}
  */
  latency: 50,
  
  // ..........................................................
  // CANCELLING
  // 
  
  /** @private */
  cancel: function(store, storeKeys) {
    return NO;
  },
  
  
  // ..........................................................
  // FETCHING
  // 
  
  /** @private */
  fetch: function(store, query) {
    
    // can only handle local queries out of the box
    if (query.get('location') !== SC.Query.LOCAL) {
      throw SC.$error('SC.Fixture data source can only fetch local queries');
    }

    if (!query.get('recordType') && !query.get('recordTypes')) {
      throw SC.$error('SC.Fixture data source can only fetch queries with one or more record types');
    }
    
    if (this.get('simulateRemoteResponse')) {
      this.invokeLater(this._fetch, this.get('latency'), store, query);
      
    } else this._fetch(store, query);
  },
  
  /** @private
    Actually performs the fetch.  
  */
  _fetch: function(store, query) {
    
    // NOTE: Assumes recordType or recordTypes is defined.  checked in fetch()
    var recordType = query.get('recordType'),
        recordTypes = query.get('recordTypes') || [recordType];
        
    // load fixtures for each recordType
    recordTypes.forEach(function(recordType) {
      if (SC.typeOf(recordType) === SC.T_STRING) {
        recordType = SC.objectForPropertyPath(recordType);
      }
      
      if (recordType) this.loadFixturesFor(store, recordType);
    }, this);
    
    // notify that query has now loaded - puts it into a READY state
    store.dataSourceDidFetchQuery(query);
  },
  
  // ..........................................................
  // RETRIEVING
  // 
  
  /** @private */
  retrieveRecords: function(store, storeKeys) {
    // first let's see if the fixture data source can handle any of the
    // storeKeys
    var latency = this.get('latency'),
        ret     = this.hasFixturesFor(storeKeys) ;
    if (!ret) return ret ;
    
    if (this.get('simulateRemoteResponse')) {
      this.invokeLater(this._retrieveRecords, latency, store, storeKeys);
    } else this._retrieveRecords(store, storeKeys);
    
    return ret ;
  },
  
  _retrieveRecords: function(store, storeKeys) {
    
    storeKeys.forEach(function(storeKey) {
      var ret        = [], 
          recordType = SC.Store.recordTypeFor(storeKey),
          id         = store.idFor(storeKey),
          hash       = this.fixtureForStoreKey(store, storeKey);
      ret.push(storeKey);
      store.dataSourceDidComplete(storeKey, hash, id);
    }, this);
  },
  
  // ..........................................................
  // UPDATE
  // 
  
  /** @private */
  updateRecords: function(store, storeKeys, params) {
    // first let's see if the fixture data source can handle any of the
    // storeKeys
    var latency = this.get('latency'),
        ret     = this.hasFixturesFor(storeKeys) ;
    if (!ret) return ret ;
    
    if (this.get('simulateRemoteResponse')) {
      this.invokeLater(this._updateRecords, latency, store, storeKeys);
    } else this._updateRecords(store, storeKeys);
    
    return ret ;
  },
  
  _updateRecords: function(store, storeKeys) {
    storeKeys.forEach(function(storeKey) {
      var hash = store.readDataHash(storeKey);
      this.setFixtureForStoreKey(store, storeKey, hash);
      store.dataSourceDidComplete(storeKey);  
    }, this);
  },


  // ..........................................................
  // CREATE RECORDS
  // 
  
  /** @private */
  createRecords: function(store, storeKeys, params) {
    // first let's see if the fixture data source can handle any of the
    // storeKeys
    var latency = this.get('latency');
    
    if (this.get('simulateRemoteResponse')) {
      this.invokeLater(this._createRecords, latency, store, storeKeys);
    } else this._createRecords(store, storeKeys);
    
    return YES ;
  },

  _createRecords: function(store, storeKeys) {
    storeKeys.forEach(function(storeKey) {
      var id         = store.idFor(storeKey),
          recordType = store.recordTypeFor(storeKey),
          dataHash   = store.readDataHash(storeKey), 
          fixtures   = this.fixturesFor(recordType);

      if (!id) id = this.generateIdFor(recordType, dataHash, store, storeKey);
      this._invalidateCachesFor(recordType, storeKey, id);
      fixtures[id] = dataHash;

      store.dataSourceDidComplete(storeKey, null, id);
    }, this);
  },

  // ..........................................................
  // DESTROY RECORDS
  // 
  
  /** @private */
  destroyRecords: function(store, storeKeys, params) {
    // first let's see if the fixture data source can handle any of the
    // storeKeys
    var latency = this.get('latency'),
        ret     = this.hasFixturesFor(storeKeys) ;
    if (!ret) return ret ;
    
    if (this.get('simulateRemoteResponse')) {
      this.invokeLater(this._destroyRecords, latency, store, storeKeys);
    } else this._destroyRecords(store, storeKeys);
    
    return ret ;
  },
  

  _destroyRecords: function(store, storeKeys) {
    storeKeys.forEach(function(storeKey) {
      var id         = store.idFor(storeKey),
          recordType = store.recordTypeFor(storeKey),
          fixtures   = this.fixturesFor(recordType);

      this._invalidateCachesFor(recordType, storeKey, id);
      if (id) delete fixtures[id];
      store.dataSourceDidDestroy(storeKey);  
    }, this);
  },
  
  // ..........................................................
  // INTERNAL METHODS/PRIMITIVES
  // 

  /**
    Load fixtures for a given fetchKey into the store
    and push it to the ret array.
    
    @param {SC.Store} store the store to load into
    @param {SC.Record} recordType the record type to load
    @param {SC.Array} ret is passed, array to add loaded storeKeys to.
    @returns {SC.Fixture} receiver
  */
  loadFixturesFor: function(store, recordType, ret) {
    var hashes   = [],
        dataHashes, i, storeKey ;
    
    dataHashes = this.fixturesFor(recordType);
    
    for(i in dataHashes){
      storeKey = recordType.storeKeyFor(i);
      if (store.peekStatus(storeKey) === SC.Record.EMPTY) {
        hashes.push(dataHashes[i]);
      }
      if (ret) ret.push(storeKey);
    }

    // only load records that were not already loaded to avoid infinite loops
    if (hashes && hashes.length>0) store.loadRecords(recordType, hashes);
    
    return this ;
  },
  

  /**
    Generates an id for the passed record type.  You can override this if 
    needed.  The default generates a storekey and formats it as a string.
    
    @param {Class} recordType Subclass of SC.Record
    @param {Hash} dataHash the data hash for the record
    @param {SC.Store} store the store 
    @param {Number} storeKey store key for the item
    @returns {String}
  */
  generateIdFor: function(recordType, dataHash, store, storeKey) {
    return "@id%@".fmt(SC.Store.generateStoreKey());
  },
  
  /**
    Based on the storeKey it returns the specified fixtures
    
    @param {SC.Store} store the store 
    @param {Number} storeKey the storeKey
    @returns {Hash} data hash or null
  */
  fixtureForStoreKey: function(store, storeKey) {
    var id         = store.idFor(storeKey),
        recordType = store.recordTypeFor(storeKey),
        fixtures   = this.fixturesFor(recordType);
    return fixtures ? fixtures[id] : null;
  },
  
  /**
    Update the data hash fixture for the named store key.  
    
    @param {SC.Store} store the store 
    @param {Number} storeKey the storeKey
    @param {Hash} dataHash 
    @returns {SC.FixturesDataSource} receiver
  */
  setFixtureForStoreKey: function(store, storeKey, dataHash) {
    var id         = store.idFor(storeKey),
        recordType = store.recordTypeFor(storeKey),
        fixtures   = this.fixturesFor(recordType);
    this._invalidateCachesFor(recordType, storeKey, id);
    fixtures[id] = dataHash;
    return this ;
  },
  
  /** 
    Get the fixtures for the passed record type and prepare them if needed.
    Return cached value when complete.
    
    @param {SC.Record} recordType
    @returns {Hash} data hashes
  */
  fixturesFor: function(recordType) {
    // get basic fixtures hash.
    if (!this._fixtures) this._fixtures = {};
    var fixtures = this._fixtures[SC.guidFor(recordType)];
    if (fixtures) return fixtures ; 
    
    // need to load fixtures.
    var dataHashes = recordType ? recordType.FIXTURES : null,
        len        = dataHashes ? dataHashes.length : 0,
        primaryKey = recordType ? recordType.prototype.primaryKey : 'guid',
        idx, dataHash, id ;

    this._fixtures[SC.guidFor(recordType)] = fixtures = {} ; 
    for(idx=0;idx<len;idx++) {      
      dataHash = dataHashes[idx];
      id = dataHash[primaryKey];
      if (!id) id = this.generateIdFor(recordType, dataHash); 
      fixtures[id] = dataHash;
    }  
    return fixtures;
  },
  
  /**
    Returns YES if fixtures for a given recordType have already been loaded
    
    @param {SC.Record} recordType
    @returns {Boolean} storeKeys
  */
  fixturesLoadedFor: function(recordType) {
    if (!this._fixtures) return NO;
    var ret = [], fixtures = this._fixtures[SC.guidFor(recordType)];
    return fixtures ? YES: NO;
  },
  
  /**
    Returns YES or SC.MIXED_STATE if one or more of the storeKeys can be 
    handled by the fixture data source.
    
    @param {Array} storeKeys the store keys
    @returns {Boolean} YES if all handled, MIXED_STATE if some handled
  */
  hasFixturesFor: function(storeKeys) {
    var ret = NO ;
    storeKeys.forEach(function(storeKey) {
      if (ret !== SC.MIXED_STATE) {
        var recordType = SC.Store.recordTypeFor(storeKey),
            fixtures   = recordType ? recordType.FIXTURES : null ;
        if (fixtures && fixtures.length && fixtures.length>0) {
          if (ret === NO) ret = YES ;
        } else if (ret === YES) ret = SC.MIXED_STATE ;
      }
    }, this);
    
    return ret ;
  },
  
  /** @private
    Invalidates any internal caches based on the recordType and optional 
    other parameters.  Currently this only invalidates the storeKeyCache used
    for fetch, but it could invalidate others later as well.
    
    @param {SC.Record} recordType the type of record modified
    @param {Number} storeKey optional store key
    @param {String} id optional record id
    @returns {SC.FixturesDataSource} receiver
  */
  _invalidateCachesFor: function(recordType, storeKey, id) {
    var cache = this._storeKeyCache;
    if (cache) delete cache[SC.guidFor(recordType)];
    return this ;
  }
  
});

/**
  Default fixtures instance for use in applications.
  
  @property {SC.FixturesDataSource}
*/
SC.Record.fixtures = SC.FixturesDataSource.create();

/* >>>>>>>>>> BEGIN source/fixtures/author_fixtures.js */
// 500 records.

var AuthorFixtures = [{"type": "Author",
 "guid": "4995bc373454a",
"fullName": "Gerry Woolery 4",
 "bookTitle": "The Madness of the Meddler",
 "address":" MIT, 21 Castro St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc37345ab",
"fullName": "Forrest Eggbert 2",
 "bookTitle": "The Night Inferno",
 "address":" Harvard, 86 University Loop, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc37345c0",
"fullName": "Dorthy Wilson 4",
 "bookTitle": "The Nightmare of Space",
 "address":" Harvard, 283 Elm St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc37345e4",
"fullName": "Nathan Lineman 4",
 "bookTitle": "The Night of the Ice",
 "address":" College University, 199 First St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3734605",
"fullName": "Phinehas Laurenzi 3",
 "bookTitle": "The Day Infinity",
 "address":" Foothill College, 144 First St, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3734618",
"fullName": "Avis Cass 3",
 "bookTitle": "Masque of Space",
 "address":" London University, 75 Fifth Ave, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc373462d",
"fullName": "Everard Richardson 1",
 "bookTitle": "The Day of the Horn",
 "address":" London University, 265 Lazaneo St, New York, NY"},
{"type": "Author",
 "guid": "4995bc3734641",
"fullName": "Su Strickland 2",
 "bookTitle": "The Day Ambassador",
 "address":" Santa Clara University, 461 Dana St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3734655",
"fullName": "Patton Kooser 2",
 "bookTitle": "The Ultimate Seed",
 "address":" London University, 235 Van Ness Blvd, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc373466e",
"fullName": "Janelle Howard 3",
 "bookTitle": "The Fury Massacre",
 "address":" Springfield University, 411 Main St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3734685",
"fullName": "Eliza Ropes 2",
 "bookTitle": "The Fear Robots",
 "address":" Foothill College, 386 Broadway Blvd, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc373469a",
"fullName": "Alisya Drennan 2",
 "bookTitle": "The Fear Paradise",
 "address":" University of Southampton, 282 Elm St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc37346b1",
"fullName": "Lori Magor 4",
 "bookTitle": "The Madness Attack",
 "address":" MIT, 429 Dana St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc37346c4",
"fullName": "Amethyst Evans 4",
 "bookTitle": "The Fear of the Thieves",
 "address":" London University, 309 Main St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc37346d8",
"fullName": "Ridley Ewing 2",
 "bookTitle": "The Killer Angel",
 "address":" New York University, 470 Broadway Blvd, New York, NY"},
{"type": "Author",
 "guid": "4995bc37346ef",
"fullName": "Sloane Moulton 1",
 "bookTitle": "The Dead of Time",
 "address":" Springfield University, 1 Dana St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3734704",
"fullName": "Marquis Fuchs 3",
 "bookTitle": "The Seeds of Menace",
 "address":" CalTech, 348 Fifth Ave, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3734718",
"fullName": "August Feufer 4",
 "bookTitle": "The Fangs",
 "address":" CalTech, 244 Broadway Blvd, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc373472c",
"fullName": "Alix Rifler 1",
 "bookTitle": "The Day Whisper",
 "address":" Santa Clara University, 368 Oak Ave, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3734740",
"fullName": "Virgil Pinney 3",
 "bookTitle": "The Death of the Hive",
 "address":" College University, 452 Elm St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc373475d",
"fullName": "Carin Burnett 4",
 "bookTitle": "The Space of the Mist",
 "address":" Michigan State University, 331 University Loop, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3734774",
"fullName": "Matty Cypret 2",
 "bookTitle": "Crater of Day",
 "address":" London University, 37 Broadway Blvd, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3734794",
"fullName": "Matilda Rockwell 3",
 "bookTitle": "The Pirate Masters",
 "address":" CalTech, 487 Bloom St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc37347b0",
"fullName": "Luann Garneis 1",
 "bookTitle": "The Day of the Keys",
 "address":" Springfield University, 418 Dana St, New York, NY"},
{"type": "Author",
 "guid": "4995bc37347c4",
"fullName": "Alysha Fox 1",
 "bookTitle": "The Death Face",
 "address":" Springfield University, 423 Castro St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc37347d9",
"fullName": "Clifford Dugger 3",
 "bookTitle": "The Ultimate Inferno",
 "address":" MIT, 478 Lazaneo St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc37347ec",
"fullName": "Christianne Taggart 3",
 "bookTitle": "The Curse of Day",
 "address":" Stanford University, 83 Lazaneo St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc373480b",
"fullName": "Kestrel Nehling 2",
 "bookTitle": "The Machines History",
 "address":" Santa Clara University, 296 Bloom St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc373481f",
"fullName": "Mackenzie Pittman 1",
 "bookTitle": "Cave of Night",
 "address":" New York University, 489 Elm St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3734833",
"fullName": "Sheila Ammons 4",
 "bookTitle": "Robots of Menace",
 "address":" Harvard, 211 Second St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3734847",
"fullName": "September Glover 4",
 "bookTitle": "The Illusion Carnival",
 "address":" London University, 370 Fifth Ave, New York, NY"},
{"type": "Author",
 "guid": "4995bc3734863",
"fullName": "Porsche Gilman 1",
 "bookTitle": "The Seeds of Menace",
 "address":" Michigan State University, 1 Fifth Ave, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3734875",
"fullName": "Vance Jolce 1",
 "bookTitle": "The Final Time",
 "address":" CalTech, 364 University Loop, London, UK"},
{"type": "Author",
 "guid": "4995bc373488a",
"fullName": "Clifford Dugger 4",
 "bookTitle": "Dreams of Menace",
 "address":" Springfield University, 211 First St, New York, NY"},
{"type": "Author",
 "guid": "4995bc373489e",
"fullName": "Zander Pershing 1",
 "bookTitle": "Killer of Menace",
 "address":" Harvard, 464 Dana St, London, UK"},
{"type": "Author",
 "guid": "4995bc37348b2",
"fullName": "Joye Eisenman 3",
 "bookTitle": "The Whisper Faces",
 "address":" College University, 171 Lazaneo St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc37348c5",
"fullName": "Phyliss Saylor 3",
 "bookTitle": "The Fury Secret",
 "address":" London University, 443 Dana St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc37348e1",
"fullName": "Duke Rosenstiehl 1",
 "bookTitle": "The Time Fangs",
 "address":" CalTech, 28 Oak Ave, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc37348f3",
"fullName": "Silvester Mcfall 3",
 "bookTitle": "Whispers of Madness",
 "address":" MIT, 217 First St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3734909",
"fullName": "Branda Wood 1",
 "bookTitle": "The Inferno",
 "address":" London University, 120 University Loop, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc373491d",
"fullName": "Em Leichter 1",
 "bookTitle": "The Day of the Massacre",
 "address":" CalTech, 113 Castro St, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3734931",
"fullName": "Bonita Downing 4",
 "bookTitle": "Minds of Fury",
 "address":" Santa Clara University, 64 University Loop, London, UK"},
{"type": "Author",
 "guid": "4995bc3734944",
"fullName": "Norm Burns 4",
 "bookTitle": "The Machines Mists",
 "address":" UC Santa Cruz, 27 Lazaneo St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc373495f",
"fullName": "Victor Painter 3",
 "bookTitle": "The Laboratory",
 "address":" MIT, 5 Elm St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3734974",
"fullName": "Lalla Haverrman 2",
 "bookTitle": "Planet of Death",
 "address":" University of Southampton, 60 Oak Ave, London, UK"},
{"type": "Author",
 "guid": "4995bc3734988",
"fullName": "Jeri Stroh 3",
 "bookTitle": "The Meddler",
 "address":" London University, 390 Oak Ave, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc373499c",
"fullName": "Raynard Peters 1",
 "bookTitle": "The Horror of the Minds",
 "address":" Michigan State University, 186 Van Ness Blvd, New York, NY"},
{"type": "Author",
 "guid": "4995bc37349bb",
"fullName": "Buck Eisaman 3",
 "bookTitle": "Future of Night",
 "address":" New York University, 470 First St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc37349d8",
"fullName": "Annie Surrency 3",
 "bookTitle": "The Menace Androids",
 "address":" Foothill College, 192 Bloom St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc37349f3",
"fullName": "Ashlie Newman 4",
 "bookTitle": "The Horror Key",
 "address":" MIT, 106 First St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3734a07",
"fullName": "Mabelle Staymates 2",
 "bookTitle": "The Riders of Death",
 "address":" Foothill College, 42 Broadway Blvd, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3734a22",
"fullName": "Eveleen Mixey 3",
 "bookTitle": "The Doom of the Jaws",
 "address":" New York University, 218 University Loop, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3734a5f",
"fullName": "Anneka Gist 3",
 "bookTitle": "Ark of Space",
 "address":" London University, 301 Van Ness Blvd, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3734a75",
"fullName": "Avis Cass 3",
 "bookTitle": "The Doomed Pit",
 "address":" Foothill College, 40 Second St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3734a89",
"fullName": "Cedar Garry 3",
 "bookTitle": "The Death Dead",
 "address":" University of Southampton, 206 Bloom St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3734aa3",
"fullName": "Kezia Henry 1",
 "bookTitle": "The Operation",
 "address":" MIT, 294 First St, New York, NY"},
{"type": "Author",
 "guid": "4995bc3734ab8",
"fullName": "Lindsey Straub 3",
 "bookTitle": "The Fury of the Angel",
 "address":" Stanford University, 11 Dana St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3734aca",
"fullName": "Cornell Siegrist 1",
 "bookTitle": "The Ghost",
 "address":" College University, 310 Second St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3734ae5",
"fullName": "Raine Warrick 2",
 "bookTitle": "The Menace Myth",
 "address":" Springfield University, 360 University Loop, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3734af9",
"fullName": "Marci Caesar 2",
 "bookTitle": "Fangs of Fury",
 "address":" Santa Clara University, 486 Main St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3734b0d",
"fullName": "Hewie Rose 2",
 "bookTitle": "Mirror of Night",
 "address":" CalTech, 419 Elm St, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3734b26",
"fullName": "Titania Tilton 3",
 "bookTitle": "The Day of the Mists",
 "address":" Michigan State University, 251 Main St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3734b3b",
"fullName": "Amyas Hice 1",
 "bookTitle": "City of Menace",
 "address":" Santa Clara University, 380 Lazaneo St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3734b5c",
"fullName": "Lyric Richards 1",
 "bookTitle": "The Impossible Doors",
 "address":" MIT, 412 Elm St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3734b6f",
"fullName": "Lianne Kemble 4",
 "bookTitle": "The Mind Massacre",
 "address":" Harvard, 318 Fifth Ave, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3734b83",
"fullName": "Gabe Milliron 4",
 "bookTitle": "The Carnival",
 "address":" MIT, 187 Second St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3734b97",
"fullName": "Willis Costello 4",
 "bookTitle": "The Night of the Bandits",
 "address":" Michigan State University, 114 Elm St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3734bb6",
"fullName": "Lottie Sherlock 3",
 "bookTitle": "The Space Skull",
 "address":" Foothill College, 165 Main St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3734bc8",
"fullName": "Frieda Wade 2",
 "bookTitle": "The Operation",
 "address":" Santa Clara University, 179 University Loop, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3734bde",
"fullName": "Chip Haynes 1",
 "bookTitle": "The Robot of Night",
 "address":" Foothill College, 258 First St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3734bf2",
"fullName": "Denzel Buehler 3",
 "bookTitle": "The Night of the Brides",
 "address":" Michigan State University, 138 First St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3734c0e",
"fullName": "Kaelee Johnson 3",
 "bookTitle": "The Evil Invasion",
 "address":" MIT, 121 Fifth Ave, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3734c25",
"fullName": "Prissy Cressman 1",
 "bookTitle": "Monster of Day",
 "address":" CalTech, 53 Second St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3734c38",
"fullName": "Anne Roadman 4",
 "bookTitle": "The Meddler of Fear",
 "address":" MIT, 374 Broadway Blvd, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3734c57",
"fullName": "Stacy Moffat 3",
 "bookTitle": "The Menace Mist",
 "address":" University of Southampton, 42 Second St, London, UK"},
{"type": "Author",
 "guid": "4995bc3734c6b",
"fullName": "Jerold Jenkins 3",
 "bookTitle": "The Thieves of Time",
 "address":" London University, 188 Broadway Blvd, London, UK"},
{"type": "Author",
 "guid": "4995bc3734c7f",
"fullName": "Berniece Berry 2",
 "bookTitle": "The Illusion Ark",
 "address":" College University, 148 Second St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3734c92",
"fullName": "Tim Beck 3",
 "bookTitle": "The Warrior",
 "address":" New York University, 47 Broadway Blvd, London, UK"},
{"type": "Author",
 "guid": "4995bc3734cad",
"fullName": "Alexis Weisgarber 1",
 "bookTitle": "The Space of the Crater",
 "address":" Harvard, 47 Elm St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3734cc0",
"fullName": "Levi Wilkinson 1",
 "bookTitle": "The Ambassador of Horror",
 "address":" UC Santa Cruz, 34 Lazaneo St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3734cd4",
"fullName": "Bailey Lauffer 3",
 "bookTitle": "Fury of Doom",
 "address":" New York University, 227 Castro St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3734ce7",
"fullName": "Gerry Woolery 1",
 "bookTitle": "The Menace of the Computers",
 "address":" Springfield University, 8 Main St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3734cfb",
"fullName": "Hale Alliman 2",
 "bookTitle": "The Paradise of Death",
 "address":" Santa Clara University, 21 University Loop, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3734d0f",
"fullName": "Everard Richardson 2",
 "bookTitle": "The Skull",
 "address":" Santa Clara University, 391 Elm St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3734d2c",
"fullName": "Tammie Crawford 1",
 "bookTitle": "The Empty Runaway",
 "address":" Michigan State University, 155 Van Ness Blvd, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3734d3f",
"fullName": "Xavier Porter 3",
 "bookTitle": "The Resurrection of Death",
 "address":" Springfield University, 187 Lazaneo St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3734d53",
"fullName": "Alec Owens 3",
 "bookTitle": "The Madness of the History",
 "address":" New York University, 385 University Loop, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3734d67",
"fullName": "Jancis Busk 2",
 "bookTitle": "The Mind Seed",
 "address":" Harvard, 49 Main St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3734d7b",
"fullName": "Daffodil Harper 1",
 "bookTitle": "Monster of Day",
 "address":" Michigan State University, 254 Castro St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3734d8f",
"fullName": "Davey Moore 2",
 "bookTitle": "Ghost of Fury",
 "address":" Harvard, 160 Broadway Blvd, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3734dca",
"fullName": "Ridley Ewing 3",
 "bookTitle": "The Fear Awakening",
 "address":" College University, 86 Lazaneo St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3734dde",
"fullName": "Loreto Isemann 1",
 "bookTitle": "The Madness Night",
 "address":" Foothill College, 496 Van Ness Blvd, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3734df2",
"fullName": "Deshawn Pyle 4",
 "bookTitle": "Suns of Time",
 "address":" Santa Clara University, 271 Fifth Ave, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3734e07",
"fullName": "Hailey Berkheimer 3",
 "bookTitle": "The Time Smuggler",
 "address":" Stanford University, 345 Main St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3734e51",
"fullName": " 3",
 "bookTitle": "The Menace Nightmares",
 "address":" Stanford University, 346 Main St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3734e74",
"fullName": "Simona Craig 2",
 "bookTitle": "The Horror of the Ice",
 "address":" Michigan State University, 47 Bloom St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3734e89",
"fullName": "Peta Filby 1",
 "bookTitle": "Masque of Space",
 "address":" Santa Clara University, 95 Broadway Blvd, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3734ea6",
"fullName": "Kathi Williams 4",
 "bookTitle": "Madness of Death",
 "address":" Springfield University, 307 Second St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3734eba",
"fullName": "Barret Lalty 1",
 "bookTitle": "The Space of the Mirror",
 "address":" University of Southampton, 287 Fifth Ave, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3734ed9",
"fullName": "Russ Nicola 4",
 "bookTitle": "The Bride of Horror",
 "address":" University of Southampton, 270 Elm St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3734eed",
"fullName": "Maya Schrader 2",
 "bookTitle": "The Terrible Sea",
 "address":" College University, 206 First St, London, UK"},
{"type": "Author",
 "guid": "4995bc3734f01",
"fullName": "Hazel Holts 1",
 "bookTitle": "The Carnival",
 "address":" CalTech, 65 University Loop, London, UK"},
{"type": "Author",
 "guid": "4995bc3734f26",
"fullName": "Saffron Elinor 3",
 "bookTitle": "The Seeds of Menace",
 "address":" Springfield University, 462 Castro St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3734f39",
"fullName": "Tiger Whitling 2",
 "bookTitle": "The Night of the Brides",
 "address":" MIT, 139 Castro St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3734f4e",
"fullName": "Rolph Burris 4",
 "bookTitle": "The Horror Power",
 "address":" Harvard, 418 Second St, London, UK"},
{"type": "Author",
 "guid": "4995bc3734f61",
"fullName": "Mark Wheeler 1",
 "bookTitle": "The Horror Key",
 "address":" University of Southampton, 441 Bloom St, New York, NY"},
{"type": "Author",
 "guid": "4995bc3734f75",
"fullName": "Wenona Tennant 2",
 "bookTitle": "The Men",
 "address":" Stanford University, 122 Main St, New York, NY"},
{"type": "Author",
 "guid": "4995bc3734f89",
"fullName": "Callista Bishop 1",
 "bookTitle": "The Pirate Masters",
 "address":" UC Santa Cruz, 127 Main St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3734fa4",
"fullName": "Cecil Rodacker 2",
 "bookTitle": "The Fury of the Wings",
 "address":" MIT, 499 Fifth Ave, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3734fb7",
"fullName": "Liliana Northey 4",
 "bookTitle": "The Fear Awakening",
 "address":" Harvard, 185 First St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3734fcb",
"fullName": "Webster Jelliman 1",
 "bookTitle": "The Talons of Day",
 "address":" University of Southampton, 472 Lazaneo St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3734fdf",
"fullName": "Loreen Buck 4",
 "bookTitle": "The Masque of Doom",
 "address":" UC Santa Cruz, 122 Broadway Blvd, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3734ff3",
"fullName": "Keisha Klockman 2",
 "bookTitle": "The Ice Web",
 "address":" MIT, 88 Lazaneo St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3735006",
"fullName": "Bennett Little 1",
 "bookTitle": "Revelation of Menace",
 "address":" UC Santa Cruz, 118 University Loop, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3735022",
"fullName": "Louis Waldron 1",
 "bookTitle": "The Mountain Suns",
 "address":" CalTech, 79 First St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3735034",
"fullName": "Sophia Spring 1",
 "bookTitle": "The Death of the Nightmares",
 "address":" Santa Clara University, 450 First St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3735048",
"fullName": "Joscelin Nash 3",
 "bookTitle": "The Day Monster",
 "address":" Santa Clara University, 191 Lazaneo St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc373505c",
"fullName": "Porsche Gilman 1",
 "bookTitle": "Robots of Night",
 "address":" CalTech, 338 First St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3735070",
"fullName": "Deshawn Pyle 4",
 "bookTitle": "The Space Brides",
 "address":" Michigan State University, 204 Second St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3735084",
"fullName": "Galen Flanders 2",
 "bookTitle": "The Secret Devils",
 "address":" CalTech, 219 Castro St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc37350a5",
"fullName": "Lonnie Linton 3",
 "bookTitle": "The Armageddon",
 "address":" London University, 214 Elm St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc37350ba",
"fullName": "Melvin Wilkerson 4",
 "bookTitle": "The Space Reign",
 "address":" Harvard, 71 Bloom St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc37350d0",
"fullName": "Eleanor Bennett 4",
 "bookTitle": "Runaway of Death",
 "address":" Harvard, 148 Castro St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc37350e4",
"fullName": "Fawn Carr 3",
 "bookTitle": "The Warrior of Menace",
 "address":" Springfield University, 202 Oak Ave, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc37350f8",
"fullName": "Linsay Mcmullen 4",
 "bookTitle": "The Doom Masters",
 "address":" Harvard, 116 First St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3735110",
"fullName": "Amyas Hice 4",
 "bookTitle": "The Space Skull",
 "address":" College University, 6 Fifth Ave, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3735123",
"fullName": "Monty Kava 4",
 "bookTitle": "The Day Ice",
 "address":" Santa Clara University, 175 Elm St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3735138",
"fullName": "Brock Young 4",
 "bookTitle": "The Killer Sound",
 "address":" College University, 414 University Loop, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc373514c",
"fullName": "Belinda Alice 3",
 "bookTitle": "The Deadly Memories",
 "address":" UC Santa Cruz, 172 Elm St, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3735160",
"fullName": "Marlene Agnes 4",
 "bookTitle": "The Death Creature",
 "address":" CalTech, 291 Van Ness Blvd, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3735174",
"fullName": "Godric Sommer 3",
 "bookTitle": "The Fury Infinity",
 "address":" CalTech, 290 Oak Ave, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc373518d",
"fullName": "Janis Bullard 2",
 "bookTitle": "The Wings",
 "address":" Foothill College, 265 Van Ness Blvd, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc37351a3",
"fullName": "Pamella Mckee 3",
 "bookTitle": "The Children of Madness",
 "address":" London University, 273 Broadway Blvd, London, UK"},
{"type": "Author",
 "guid": "4995bc37351c8",
"fullName": "Prince Demuth 4",
 "bookTitle": "The Riders",
 "address":" Michigan State University, 193 Main St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc37351dc",
"fullName": "Kristal Young 2",
 "bookTitle": "The Pirate Nightmares",
 "address":" Foothill College, 354 Castro St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc37351ef",
"fullName": "Osmund Pritchard 1",
 "bookTitle": "The Time Suns",
 "address":" University of Southampton, 250 Dana St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3735209",
"fullName": "Jazmine Adams 3",
 "bookTitle": "The Day of the Computers",
 "address":" Stanford University, 340 Van Ness Blvd, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3735221",
"fullName": "Rose Mays 3",
 "bookTitle": "Meddler of Space",
 "address":" UC Santa Cruz, 409 Bloom St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc373523f",
"fullName": "Rylee Fiddler 2",
 "bookTitle": "Masque of Space",
 "address":" UC Santa Cruz, 413 Fifth Ave, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3735253",
"fullName": "Meg Coveney 1",
 "bookTitle": "Devils of Fury",
 "address":" MIT, 446 Oak Ave, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3735267",
"fullName": "Pamelia Mang 4",
 "bookTitle": "The Time of the Pyramid",
 "address":" New York University, 131 Main St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc373527b",
"fullName": "Raphael Wilks 4",
 "bookTitle": "Ark of Day",
 "address":" Foothill College, 44 Fifth Ave, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc373529a",
"fullName": "Matilda Rockwell 4",
 "bookTitle": "The Time Smugglers",
 "address":" Michigan State University, 135 Van Ness Blvd, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc37352ae",
"fullName": "Duke Rosenstiehl 1",
 "bookTitle": "Mist of Death",
 "address":" Santa Clara University, 160 First St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc37352cf",
"fullName": "Effie Greenwood 2",
 "bookTitle": "The Fury Mist",
 "address":" UC Santa Cruz, 288 Main St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc37352e3",
"fullName": "Kathy Huston 4",
 "bookTitle": "History of Doom",
 "address":" Harvard, 299 Bloom St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc37352f6",
"fullName": "Rina Prescott 1",
 "bookTitle": "The Children of Madness",
 "address":" College University, 458 Elm St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3735319",
"fullName": "Raven Pirl 4",
 "bookTitle": "Smugglers of Night",
 "address":" UC Santa Cruz, 467 Main St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc373532c",
"fullName": "Xavier Porter 2",
 "bookTitle": "The Robot of Night",
 "address":" University of Southampton, 52 Lazaneo St, London, UK"},
{"type": "Author",
 "guid": "4995bc373533f",
"fullName": "Lianne Kemble 1",
 "bookTitle": "The Seeds",
 "address":" College University, 482 Castro St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3735353",
"fullName": "Byrne Bruxner 1",
 "bookTitle": "The Long Suns",
 "address":" CalTech, 238 Dana St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3735367",
"fullName": "Byrne Bruxner 3",
 "bookTitle": "The Wings",
 "address":" New York University, 331 Van Ness Blvd, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc373537a",
"fullName": "Fawn Carr 4",
 "bookTitle": "The Laboratory",
 "address":" CalTech, 237 Fifth Ave, London, UK"},
{"type": "Author",
 "guid": "4995bc3735398",
"fullName": "Alyx Hincken 2",
 "bookTitle": "The Revelation",
 "address":" CalTech, 41 First St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc37353aa",
"fullName": "Xerxes Newbern 1",
 "bookTitle": "The Ghost",
 "address":" Stanford University, 424 Van Ness Blvd, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc37353c0",
"fullName": "Alton Saline 3",
 "bookTitle": "The Space of the Leisure",
 "address":" London University, 102 Bloom St, London, UK"},
{"type": "Author",
 "guid": "4995bc37353d3",
"fullName": "Lina Sanborn 1",
 "bookTitle": "The Night Caves",
 "address":" Michigan State University, 79 Second St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc37353e7",
"fullName": "Laura Herrold 3",
 "bookTitle": "The Runaway Gods",
 "address":" College University, 476 Dana St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc37353fb",
"fullName": "Maximilian Wolfe 1",
 "bookTitle": "The Doom Meddler",
 "address":" Stanford University, 400 Lazaneo St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3735418",
"fullName": "Ben Lombardi 3",
 "bookTitle": "The Day",
 "address":" College University, 139 Bloom St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc373543d",
"fullName": "Tiger Whitling 4",
 "bookTitle": "The Fury Sea",
 "address":" MIT, 55 Second St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3735450",
"fullName": "Nena Davis 1",
 "bookTitle": "The Operation of Menace",
 "address":" University of Southampton, 2 First St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3735464",
"fullName": "Luther Johnston 3",
 "bookTitle": "The Keeper of Space",
 "address":" Foothill College, 76 University Loop, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc373547e",
"fullName": "Rikki Graham 3",
 "bookTitle": "The Devil",
 "address":" Foothill College, 322 Castro St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3735493",
"fullName": "Alec Owens 1",
 "bookTitle": "The Hive of Doom",
 "address":" Michigan State University, 448 Bloom St, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc37354b2",
"fullName": "Lettie Roberts 3",
 "bookTitle": "Dead of Time",
 "address":" Stanford University, 152 Second St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc37354c5",
"fullName": "Amalia Grant 2",
 "bookTitle": "The Talons of Day",
 "address":" University of Southampton, 42 Oak Ave, New York, NY"},
{"type": "Author",
 "guid": "4995bc37354d9",
"fullName": "Brady Smail 2",
 "bookTitle": "The Horror Visitor",
 "address":" University of Southampton, 350 Castro St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc37354ed",
"fullName": "Lori Magor 2",
 "bookTitle": "The Ultimate Seed",
 "address":" London University, 397 Main St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc373550f",
"fullName": "Jewel Mortland 2",
 "bookTitle": "The Horror of the Ragnarok",
 "address":" College University, 46 Elm St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3735538",
"fullName": "Kaitlyn Paul 1",
 "bookTitle": "The Memories",
 "address":" New York University, 489 Lazaneo St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc373554e",
"fullName": "Aletha Lambert 1",
 "bookTitle": "The Horror of the Universe",
 "address":" Stanford University, 425 Van Ness Blvd, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3735563",
"fullName": "Lela Warner 2",
 "bookTitle": "The Menace of the Anvil",
 "address":" CalTech, 430 Fifth Ave, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3735578",
"fullName": "Brandi Bauerle 4",
 "bookTitle": "The Fear of the Key",
 "address":" College University, 485 Elm St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc373558c",
"fullName": "Marva Wise 4",
 "bookTitle": "The Meddler",
 "address":" Stanford University, 388 Second St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc373559e",
"fullName": "Seymour Fischer 1",
 "bookTitle": "The Rock",
 "address":" Springfield University, 375 First St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc37355b2",
"fullName": "Honor Simmons 3",
 "bookTitle": "The Menace Mist",
 "address":" CalTech, 179 Broadway Blvd, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc37355c7",
"fullName": "Sarah Chapman 1",
 "bookTitle": "The Day Androids",
 "address":" UC Santa Cruz, 317 Dana St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc37355db",
"fullName": "Suzanna Neely 1",
 "bookTitle": "The Secret Devils",
 "address":" CalTech, 201 Main St, New York, NY"},
{"type": "Author",
 "guid": "4995bc37355ee",
"fullName": "Wil Hoffhants 2",
 "bookTitle": "The Empty Machines",
 "address":" UC Santa Cruz, 446 Bloom St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3735602",
"fullName": "Ridley Ewing 4",
 "bookTitle": "The Ghost of Menace",
 "address":" College University, 252 Broadway Blvd, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3735616",
"fullName": "Rodge Catherina 2",
 "bookTitle": "The Empty Herald",
 "address":" Michigan State University, 367 Van Ness Blvd, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc373562a",
"fullName": "Brady Smail 1",
 "bookTitle": "The Day Ice",
 "address":" London University, 426 Elm St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc373563e",
"fullName": "Antony Stern 4",
 "bookTitle": "Reign of Night",
 "address":" University of Southampton, 6 Van Ness Blvd, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3735652",
"fullName": "Loreen Buck 1",
 "bookTitle": "The Day Whisper",
 "address":" Michigan State University, 47 Main St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3735666",
"fullName": "Melita Barkley 1",
 "bookTitle": "The Meddler of Fear",
 "address":" CalTech, 328 Lazaneo St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc373567a",
"fullName": "Kerensa Benford 2",
 "bookTitle": "The Menace of the Ghosts",
 "address":" New York University, 411 Elm St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc373568e",
"fullName": "Prue Putnam 2",
 "bookTitle": "The Doom of the Night",
 "address":" College University, 340 Oak Ave, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc37356aa",
"fullName": "Rosaleen Mench 3",
 "bookTitle": "The Devil",
 "address":" College University, 266 First St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc37356bc",
"fullName": "Washington Rummel 4",
 "bookTitle": "Man of Madness",
 "address":" College University, 54 Castro St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc37356d0",
"fullName": "Leyton Jyllian 1",
 "bookTitle": "The Menace of the Computers",
 "address":" Springfield University, 432 First St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc37356e4",
"fullName": "Perce Pennington 3",
 "bookTitle": "The Seventh Child",
 "address":" College University, 178 Oak Ave, London, UK"},
{"type": "Author",
 "guid": "4995bc37356f8",
"fullName": "Sabrina Beedell 3",
 "bookTitle": "Runaway of Death",
 "address":" Stanford University, 105 Lazaneo St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3735713",
"fullName": "Mckenzie Carden 2",
 "bookTitle": "The Universe",
 "address":" Springfield University, 436 Broadway Blvd, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3735728",
"fullName": "Ginny Finlay 2",
 "bookTitle": "The Doom of the Massacre",
 "address":" Foothill College, 56 Broadway Blvd, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc373573c",
"fullName": "Fox Omara 4",
 "bookTitle": "The Madness Horns",
 "address":" Foothill College, 239 Fifth Ave, London, UK"},
{"type": "Author",
 "guid": "4995bc373574f",
"fullName": "Cherice Blatenberger 2",
 "bookTitle": "The Claws of Fury",
 "address":" Harvard, 235 Van Ness Blvd, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3735763",
"fullName": "Harriette Alington 4",
 "bookTitle": "The Whispers",
 "address":" College University, 203 Lazaneo St, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3735777",
"fullName": "Eldon Ream 2",
 "bookTitle": "The Revelation",
 "address":" University of Southampton, 97 Broadway Blvd, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc373578b",
"fullName": "Ambrosine Echard 4",
 "bookTitle": "The Android of Madness",
 "address":" University of Southampton, 133 Oak Ave, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc373579f",
"fullName": "Bekki Blunt 4",
 "bookTitle": "Evil of Fury",
 "address":" Springfield University, 236 Oak Ave, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc37357b2",
"fullName": "Zena Giesler 1",
 "bookTitle": "The Terrible Ghosts",
 "address":" Foothill College, 228 Bloom St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc37357c6",
"fullName": "Lalo Pery 4",
 "bookTitle": "The Fury of the Devils",
 "address":" Michigan State University, 39 Lazaneo St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc37357da",
"fullName": "Rowina Bicknell 2",
 "bookTitle": "Evil of Fury",
 "address":" University of Southampton, 471 Second St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc37357ee",
"fullName": "Candis Kanaga 4",
 "bookTitle": "The Operation",
 "address":" UC Santa Cruz, 11 Bloom St, London, UK"},
{"type": "Author",
 "guid": "4995bc3735802",
"fullName": "Jess Richter 4",
 "bookTitle": "The Bride of Fury",
 "address":" MIT, 91 University Loop, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3735816",
"fullName": "Elfreda Vanleer 1",
 "bookTitle": "The Madness of the Face",
 "address":" College University, 147 Main St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc373582a",
"fullName": "Rolo Orner 1",
 "bookTitle": "The Dead Sea",
 "address":" London University, 475 Dana St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc373583e",
"fullName": "Lottie Sherlock 1",
 "bookTitle": "The Robbers",
 "address":" Michigan State University, 306 Van Ness Blvd, New York, NY"},
{"type": "Author",
 "guid": "4995bc3735851",
"fullName": "Shyla Clarke 3",
 "bookTitle": "The Attack",
 "address":" College University, 299 Dana St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3735865",
"fullName": "Bethany Veith 3",
 "bookTitle": "The Secret Pyramids",
 "address":" Harvard, 248 Fifth Ave, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3735879",
"fullName": "Bertha Jesse 3",
 "bookTitle": "The Space of the Pit",
 "address":" Harvard, 364 University Loop, London, UK"},
{"type": "Author",
 "guid": "4995bc373588d",
"fullName": "Marylou Frankenberger 1",
 "bookTitle": "The Time Keys",
 "address":" College University, 322 Elm St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc37358a1",
"fullName": "Roderick Powell 3",
 "bookTitle": "The Inferno of Death",
 "address":" University of Southampton, 266 Main St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc37358b5",
"fullName": "Maureen Leach 3",
 "bookTitle": "The Unearthly Assassin",
 "address":" Santa Clara University, 170 Bloom St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc37358c8",
"fullName": "Jaclyn Stiffey 1",
 "bookTitle": "Dominator of Death",
 "address":" Harvard, 236 Second St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc37358dc",
"fullName": "Lindsey Straub 3",
 "bookTitle": "The Decay of Space",
 "address":" UC Santa Cruz, 155 Castro St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc37358f7",
"fullName": "Lyric Richards 1",
 "bookTitle": "The Paradise of Menace",
 "address":" Foothill College, 293 Elm St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc373590b",
"fullName": "Allycia Mackendrick 1",
 "bookTitle": "The Long Suns",
 "address":" Santa Clara University, 449 Castro St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc373591f",
"fullName": "James Buzzard 2",
 "bookTitle": "The Death of the Thieves",
 "address":" University of Southampton, 341 Oak Ave, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3735933",
"fullName": "Pamelia Mang 2",
 "bookTitle": "The Masque of Doom",
 "address":" Santa Clara University, 411 University Loop, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3735947",
"fullName": "Chandler Wildman 3",
 "bookTitle": "The Fear Awakening",
 "address":" Santa Clara University, 144 Main St, New York, NY"},
{"type": "Author",
 "guid": "4995bc373595b",
"fullName": "Tyrese Knight 2",
 "bookTitle": "The Messenger of Fear",
 "address":" Michigan State University, 342 Castro St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc373596e",
"fullName": "Emery Cavalet 2",
 "bookTitle": "City of Menace",
 "address":" CalTech, 477 Fifth Ave, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3735982",
"fullName": "Jackson Garratt 3",
 "bookTitle": "The Claws of Fear",
 "address":" College University, 25 Dana St, London, UK"},
{"type": "Author",
 "guid": "4995bc3735996",
"fullName": "Gussie Bowman 2",
 "bookTitle": "The Space of the Runaway",
 "address":" Michigan State University, 372 Main St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc37359aa",
"fullName": "Kezia Henry 2",
 "bookTitle": "The Time Ark",
 "address":" Stanford University, 199 Main St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc37359bd",
"fullName": "Quintin Hays 1",
 "bookTitle": "The Nightmares of Doom",
 "address":" Santa Clara University, 172 University Loop, London, UK"},
{"type": "Author",
 "guid": "4995bc37359d1",
"fullName": "Amalia Grant 2",
 "bookTitle": "The Fang Ghost",
 "address":" University of Southampton, 471 Fifth Ave, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc37359e5",
"fullName": "Jasper Swarner 4",
 "bookTitle": "The Time Armageddon",
 "address":" Foothill College, 65 Lazaneo St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc37359f9",
"fullName": "Tania Scott 4",
 "bookTitle": "The Secret Monster",
 "address":" Michigan State University, 24 Second St, London, UK"},
{"type": "Author",
 "guid": "4995bc3735a0d",
"fullName": "Jarrod Schreckengost 3",
 "bookTitle": "Dreams of Menace",
 "address":" New York University, 126 Bloom St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3735a21",
"fullName": "Lesley Sanforth 3",
 "bookTitle": "The Jaws of Death",
 "address":" CalTech, 357 Castro St, New York, NY"},
{"type": "Author",
 "guid": "4995bc3735a34",
"fullName": "Roosevelt Stewart 3",
 "bookTitle": "The Fear of the Mist",
 "address":" College University, 6 Main St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3735a48",
"fullName": "Jacaline Mathews 2",
 "bookTitle": "The Day of the Runaway",
 "address":" Santa Clara University, 420 Broadway Blvd, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3735a5c",
"fullName": "Kaitlyn Paul 3",
 "bookTitle": "The Carnival",
 "address":" Michigan State University, 322 Bloom St, London, UK"},
{"type": "Author",
 "guid": "4995bc3735a70",
"fullName": "Christianne Taggart 1",
 "bookTitle": "The Doomed Bride",
 "address":" Michigan State University, 289 Van Ness Blvd, London, UK"},
{"type": "Author",
 "guid": "4995bc3735a84",
"fullName": "Lawrie Toyley 1",
 "bookTitle": "The Night of the Ice",
 "address":" University of Southampton, 367 University Loop, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3735a98",
"fullName": "Gladwyn Handyside 1",
 "bookTitle": "The Fury Face",
 "address":" Springfield University, 350 University Loop, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3735ab0",
"fullName": "Raphael Wilks 4",
 "bookTitle": "Myth of Madness",
 "address":" CalTech, 187 Fifth Ave, London, UK"},
{"type": "Author",
 "guid": "4995bc3735ad1",
"fullName": "Matilda Rockwell 3",
 "bookTitle": "The Unearthly Assassin",
 "address":" Stanford University, 84 Fifth Ave, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3735ae5",
"fullName": "Alan Brown 4",
 "bookTitle": "The Menace of the Visitor",
 "address":" Springfield University, 45 Oak Ave, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3735af8",
"fullName": "Romy Ward 3",
 "bookTitle": "The Space Underworld",
 "address":" Harvard, 387 Lazaneo St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3735b0c",
"fullName": "Eldreda Flick 2",
 "bookTitle": "The Death of the Dominators",
 "address":" MIT, 453 Oak Ave, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3735b20",
"fullName": "Em Leichter 1",
 "bookTitle": "The Future Web",
 "address":" University of Southampton, 291 First St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3735b34",
"fullName": "Janella Warner 3",
 "bookTitle": "The Final Claws",
 "address":" Springfield University, 398 Castro St, New York, NY"},
{"type": "Author",
 "guid": "4995bc3735b48",
"fullName": "Chip Haynes 3",
 "bookTitle": "The Menace Thieves",
 "address":" Michigan State University, 490 Broadway Blvd, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3735b5c",
"fullName": "Lita Rumbaugh 3",
 "bookTitle": "The Child of Space",
 "address":" Springfield University, 444 First St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3735b6f",
"fullName": "Zena Giesler 3",
 "bookTitle": "The Deadly Memories",
 "address":" Harvard, 420 Main St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3735b83",
"fullName": "Polly Van 3",
 "bookTitle": "Horns of Day",
 "address":" New York University, 57 Dana St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3735b97",
"fullName": "Ceara Sanner 1",
 "bookTitle": "The Evil Assassin",
 "address":" Michigan State University, 410 Second St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3735bab",
"fullName": "Nola Bell 4",
 "bookTitle": "The Last Alien",
 "address":" Harvard, 261 Oak Ave, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3735bbf",
"fullName": "Hamilton Heyman 1",
 "bookTitle": "The Minds of Madness",
 "address":" New York University, 352 Fifth Ave, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3735bd2",
"fullName": "Neville Mildred 3",
 "bookTitle": "Mutants of Night",
 "address":" CalTech, 115 University Loop, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3735be6",
"fullName": "Fran Willcox 4",
 "bookTitle": "The Menace of the Spider",
 "address":" London University, 432 Second St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3735bfa",
"fullName": "Matty Cypret 3",
 "bookTitle": "The Day of the Vengeance",
 "address":" College University, 218 Lazaneo St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3735c0e",
"fullName": "Austen Fonblanque 4",
 "bookTitle": "The Space Reign",
 "address":" Foothill College, 142 Bloom St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3735c21",
"fullName": "Felix Mitchell 4",
 "bookTitle": "God of Doom",
 "address":" Foothill College, 45 Castro St, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3735c35",
"fullName": "Matty Cypret 3",
 "bookTitle": "The Night of the Leisure",
 "address":" London University, 9 Fifth Ave, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3735c49",
"fullName": "Cassarah Vinsant 4",
 "bookTitle": "The Seed of Night",
 "address":" Michigan State University, 20 Van Ness Blvd, London, UK"},
{"type": "Author",
 "guid": "4995bc3735c5d",
"fullName": "Vernon Perkins 1",
 "bookTitle": "Reign of Night",
 "address":" MIT, 274 Fifth Ave, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3735c71",
"fullName": "Shirley Mingle 2",
 "bookTitle": "The Smugglers of Menace",
 "address":" Harvard, 125 Dana St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3735c85",
"fullName": "Kemp Lord 4",
 "bookTitle": "The Horror Angel",
 "address":" London University, 159 Second St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3735c98",
"fullName": "Kermit Throckmorton 1",
 "bookTitle": "The Tenth Web",
 "address":" London University, 106 Van Ness Blvd, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3735cb3",
"fullName": "Delma Auman 4",
 "bookTitle": "Killer of Night",
 "address":" University of Southampton, 226 Second St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3735cc7",
"fullName": "Marly Friedline 4",
 "bookTitle": "Runaway of Horror",
 "address":" Foothill College, 256 Dana St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3735cdb",
"fullName": "Noah Kline 4",
 "bookTitle": "The Menace of the Ragnarok",
 "address":" Springfield University, 63 Bloom St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3735cef",
"fullName": "Wendy Sayre 1",
 "bookTitle": "History of Doom",
 "address":" New York University, 39 Castro St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3735d03",
"fullName": "Izzy Wyatt 4",
 "bookTitle": "The Assassin of Fear",
 "address":" University of Southampton, 73 Bloom St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3735d17",
"fullName": "Ann Sachse 2",
 "bookTitle": "The Doom Fury",
 "address":" CalTech, 133 Elm St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3735d2b",
"fullName": "Ebba Hil 1",
 "bookTitle": "Talons of Madness",
 "address":" Harvard, 54 Broadway Blvd, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3735d3f",
"fullName": "Alexina Compton 2",
 "bookTitle": "War of Time",
 "address":" University of Southampton, 44 Main St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3735d53",
"fullName": "Sybella Henley 2",
 "bookTitle": "The Illusion Revelation",
 "address":" UC Santa Cruz, 107 Van Ness Blvd, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3735d66",
"fullName": "Tylar Monahan 1",
 "bookTitle": "Image of Space",
 "address":" London University, 126 Second St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3735d7a",
"fullName": " 4",
 "bookTitle": "The False Masque",
 "address":" MIT, 318 Oak Ave, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3735d91",
"fullName": "Lorrin Reichard 2",
 "bookTitle": "The Fear of the Androids",
 "address":" Springfield University, 467 Main St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3735da5",
"fullName": "Harriette Alington 1",
 "bookTitle": "The Future of Time",
 "address":" Stanford University, 5 Castro St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3735db9",
"fullName": "Dominic Groah 3",
 "bookTitle": "Smuggler of Day",
 "address":" UC Santa Cruz, 246 Fifth Ave, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3735dcc",
"fullName": "Everard Richardson 1",
 "bookTitle": "The Revelation",
 "address":" Springfield University, 261 Dana St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3735de0",
"fullName": "Gladwyn Handyside 2",
 "bookTitle": "The Secret Monster",
 "address":" UC Santa Cruz, 94 Main St, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3735df4",
"fullName": "Kyla Moore 3",
 "bookTitle": "The Horror Robot",
 "address":" Santa Clara University, 456 Castro St, London, UK"},
{"type": "Author",
 "guid": "4995bc3735e08",
"fullName": "Latonya Roche 4",
 "bookTitle": "The Machines Spider",
 "address":" Michigan State University, 429 Elm St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3735e1c",
"fullName": "Chanel Boyd 2",
 "bookTitle": "The Horror of the Minds",
 "address":" London University, 482 Elm St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3735e2f",
"fullName": "Delice Kimmons 4",
 "bookTitle": "The Death of the Memory",
 "address":" MIT, 257 Broadway Blvd, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3735e43",
"fullName": "Cornelius Metzer 2",
 "bookTitle": "City of Menace",
 "address":" Springfield University, 353 Bloom St, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3735e57",
"fullName": "Meg Coveney 2",
 "bookTitle": "The Assassin of Fear",
 "address":" College University, 348 Lazaneo St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3735e6a",
"fullName": "Roxanna Loewentsein 2",
 "bookTitle": "The Riders of Death",
 "address":" CalTech, 125 Bloom St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3735e7e",
"fullName": "Emmett Agg 2",
 "bookTitle": "The Last Mists",
 "address":" UC Santa Cruz, 210 Oak Ave, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3735e99",
"fullName": "Junior Christman 4",
 "bookTitle": "Ragnarok of Space",
 "address":" Foothill College, 264 Second St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3735eae",
"fullName": "Wendy Sayre 2",
 "bookTitle": "The Madness Myth",
 "address":" University of Southampton, 398 Bloom St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3735ec0",
"fullName": "Amandine Catlay 1",
 "bookTitle": "The Night Inferno",
 "address":" MIT, 364 Oak Ave, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3735ed8",
"fullName": "Gordon Zadovsky 4",
 "bookTitle": "The Key of Death",
 "address":" Foothill College, 68 Fifth Ave, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3735eec",
"fullName": "Earline Judge 1",
 "bookTitle": "The Doom of the Claws",
 "address":" CalTech, 462 Bloom St, London, UK"},
{"type": "Author",
 "guid": "4995bc3735f00",
"fullName": "Chryssa Robertson 3",
 "bookTitle": "The Fear of Day",
 "address":" New York University, 323 First St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3735f14",
"fullName": "Tim Beck 4",
 "bookTitle": "The Fear of the Arc",
 "address":" New York University, 287 Lazaneo St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3735f28",
"fullName": "Sarah Chapman 4",
 "bookTitle": "Pyramids of Menace",
 "address":" University of Southampton, 289 Lazaneo St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3735f3b",
"fullName": "Serrena Canham 2",
 "bookTitle": "The Ultimate Seed",
 "address":" Springfield University, 268 Castro St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3735f4f",
"fullName": "Pierce Conrad 4",
 "bookTitle": "Future of Night",
 "address":" New York University, 44 Elm St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3735f63",
"fullName": "Sheard Alcocke 1",
 "bookTitle": "The Claws of Day",
 "address":" Springfield University, 23 Van Ness Blvd, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3735f77",
"fullName": "Prue Putnam 1",
 "bookTitle": "Robbers of Doom",
 "address":" College University, 244 Main St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3735f8a",
"fullName": "Kezia Henry 3",
 "bookTitle": "Creature of Space",
 "address":" Stanford University, 440 Lazaneo St, New York, NY"},
{"type": "Author",
 "guid": "4995bc3735f9f",
"fullName": "Chrystal Prevatt 4",
 "bookTitle": "The Day of the Mirror",
 "address":" New York University, 135 Main St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3735fb3",
"fullName": "Kim Oppenheimer 2",
 "bookTitle": "The Killers of Time",
 "address":" London University, 226 Oak Ave, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3735fc8",
"fullName": "Adolph Hayhurst 2",
 "bookTitle": "Messenger of Fear",
 "address":" MIT, 298 Fifth Ave, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3735fdb",
"fullName": "Luann Garneis 1",
 "bookTitle": "The Masque",
 "address":" Santa Clara University, 109 Van Ness Blvd, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3735ff0",
"fullName": "Hazel Holts 4",
 "bookTitle": "The Pirate Memory",
 "address":" Santa Clara University, 241 Dana St, London, UK"},
{"type": "Author",
 "guid": "4995bc3736005",
"fullName": "Brittney Lowe 1",
 "bookTitle": "The Time Smugglers",
 "address":" Springfield University, 216 University Loop, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3736367",
"fullName": "Missie Marjorie 2",
 "bookTitle": "The Computer Time",
 "address":" Michigan State University, 306 Elm St, New York, NY"},
{"type": "Author",
 "guid": "4995bc3736381",
"fullName": "Blondie Rogers 3",
 "bookTitle": "The Empty Runaway",
 "address":" UC Santa Cruz, 336 Castro St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3736396",
"fullName": "Kyla Moore 2",
 "bookTitle": "The First Cave",
 "address":" Michigan State University, 269 University Loop, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc37363ab",
"fullName": "Kaylynn Herndon 4",
 "bookTitle": "The Time of the Seeds",
 "address":" Stanford University, 201 Bloom St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc37363bf",
"fullName": "Jancis Busk 1",
 "bookTitle": "The Ultimate Resurrection",
 "address":" Harvard, 314 Main St, London, UK"},
{"type": "Author",
 "guid": "4995bc37363e0",
"fullName": "Linnie Fraser 3",
 "bookTitle": "The God",
 "address":" University of Southampton, 302 Fifth Ave, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc37363f5",
"fullName": "Tyrell Riggle 1",
 "bookTitle": "Visitors of Time",
 "address":" University of Southampton, 258 First St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc373640a",
"fullName": "Luanne Mens 3",
 "bookTitle": "The Day Sea",
 "address":" Stanford University, 422 Fifth Ave, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc373641e",
"fullName": "Everitt Thompson 3",
 "bookTitle": "The Enemies",
 "address":" University of Southampton, 57 Fifth Ave, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3736432",
"fullName": "Robynne Unk 4",
 "bookTitle": "The Fear of the Devil",
 "address":" Springfield University, 326 Castro St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc373644e",
"fullName": "Lake Elder 1",
 "bookTitle": "Spiders of Death",
 "address":" University of Southampton, 237 Fifth Ave, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3736465",
"fullName": "Gale Cross 4",
 "bookTitle": "The Mutants",
 "address":" Foothill College, 323 Broadway Blvd, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3736479",
"fullName": "Amy Mcelroy 4",
 "bookTitle": "The Caves of Madness",
 "address":" MIT, 255 Fifth Ave, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc373648d",
"fullName": "Lowell Holtzer 3",
 "bookTitle": "The Spider",
 "address":" College University, 370 Oak Ave, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc37364a1",
"fullName": "Zola Haines 4",
 "bookTitle": "The Fear of the Mist",
 "address":" New York University, 286 Fifth Ave, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc37364b4",
"fullName": "Pearce Swartzbaugh 4",
 "bookTitle": "The Menace Killers",
 "address":" Stanford University, 34 Dana St, New York, NY"},
{"type": "Author",
 "guid": "4995bc37364cc",
"fullName": "Lorayne Losey 1",
 "bookTitle": "The Messenger",
 "address":" Springfield University, 70 University Loop, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc37364e0",
"fullName": "Perdita Casteel 3",
 "bookTitle": "Illusion of Doom",
 "address":" College University, 103 First St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc37364f4",
"fullName": "Jules Leech 4",
 "bookTitle": "The Dominator",
 "address":" Foothill College, 405 Broadway Blvd, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3736508",
"fullName": "Reagan Ironmonger 1",
 "bookTitle": "Hive of Menace",
 "address":" London University, 447 University Loop, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc373651c",
"fullName": "Bevis Powers 3",
 "bookTitle": "The Sun of Death",
 "address":" Foothill College, 447 Main St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3736530",
"fullName": "Kip Mosser 4",
 "bookTitle": "The Door of Space",
 "address":" Stanford University, 294 University Loop, London, UK"},
{"type": "Author",
 "guid": "4995bc3736543",
"fullName": "Jilly Poorbaugh 3",
 "bookTitle": "The Doom of the Battlefield",
 "address":" Harvard, 360 Elm St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3736557",
"fullName": "Chip Haynes 1",
 "bookTitle": "The Unearthly Androids",
 "address":" MIT, 483 Elm St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc373656b",
"fullName": "Daffodil Harper 4",
 "bookTitle": "The War of Fury",
 "address":" Michigan State University, 483 Second St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc373657f",
"fullName": "Dorthy Wilson 2",
 "bookTitle": "The Mind Crime",
 "address":" Michigan State University, 412 Broadway Blvd, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3736593",
"fullName": "Ridley Ewing 3",
 "bookTitle": "The Night of the Universe",
 "address":" New York University, 287 First St, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc37365a7",
"fullName": "Brennan Whishaw 1",
 "bookTitle": "The War of Fury",
 "address":" University of Southampton, 499 First St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc37365bb",
"fullName": "Hale Alliman 1",
 "bookTitle": "Devils of Fury",
 "address":" Foothill College, 265 Main St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc37365d6",
"fullName": "Petronella Eckhardstein 1",
 "bookTitle": "The Mind Massacre",
 "address":" MIT, 78 Castro St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc37365ea",
"fullName": "Maurice Bagley 4",
 "bookTitle": "The Decay Claws",
 "address":" Foothill College, 159 Fifth Ave, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc37365fe",
"fullName": "Shaun Drabble 3",
 "bookTitle": "The Fang Secret",
 "address":" Michigan State University, 79 Broadway Blvd, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3736612",
"fullName": "Brady Smail 3",
 "bookTitle": "Sound of Time",
 "address":" UC Santa Cruz, 456 Elm St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3736626",
"fullName": "Juliet Shaw 3",
 "bookTitle": "The Ghost Universe",
 "address":" New York University, 379 Castro St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc373663a",
"fullName": "Lorayne Losey 3",
 "bookTitle": "The Jaws of Death",
 "address":" Michigan State University, 398 University Loop, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc373664e",
"fullName": "Lisha Enderly 4",
 "bookTitle": "The Web",
 "address":" Santa Clara University, 86 Broadway Blvd, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3736662",
"fullName": "Becky Davis 1",
 "bookTitle": "The Doom of the Claws",
 "address":" London University, 284 Van Ness Blvd, New York, NY"},
{"type": "Author",
 "guid": "4995bc3736676",
"fullName": "Leyton Jyllian 3",
 "bookTitle": "Operation of Night",
 "address":" MIT, 137 Dana St, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc373668a",
"fullName": "Alice Yates 1",
 "bookTitle": "The Madness of the Spiders",
 "address":" Stanford University, 484 First St, London, UK"},
{"type": "Author",
 "guid": "4995bc373669d",
"fullName": "Lemoine James 1",
 "bookTitle": "The Deadly Mutants",
 "address":" Springfield University, 359 Oak Ave, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc37366b1",
"fullName": "Baylee Raybould 1",
 "bookTitle": "Curse of Fear",
 "address":" Michigan State University, 154 Lazaneo St, London, UK"},
{"type": "Author",
 "guid": "4995bc37366c5",
"fullName": "Ford Steiner 2",
 "bookTitle": "The Masque of Doom",
 "address":" Michigan State University, 390 Second St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc37366d9",
"fullName": "Laureen Moon 1",
 "bookTitle": "The Fear Memories",
 "address":" Stanford University, 372 Castro St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc37366ed",
"fullName": "Colin Hair 4",
 "bookTitle": "The Time of the Secret",
 "address":" Springfield University, 464 Bloom St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3736701",
"fullName": "Haven Crissman 1",
 "bookTitle": "The Armageddon Laboratory",
 "address":" College University, 141 Lazaneo St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc373671a",
"fullName": "Ludmilla Candles 2",
 "bookTitle": "The Pyramids",
 "address":" CalTech, 303 Bloom St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc373672f",
"fullName": "Alberta Fowler 1",
 "bookTitle": "The Day of the Door",
 "address":" London University, 271 University Loop, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3736744",
"fullName": "Lowell Holtzer 3",
 "bookTitle": "The Night of the Bandits",
 "address":" University of Southampton, 173 Second St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3736758",
"fullName": "Lesley Sanforth 4",
 "bookTitle": "Robbers of Doom",
 "address":" University of Southampton, 129 Van Ness Blvd, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc373676c",
"fullName": "Vic Close 1",
 "bookTitle": "The Bride of Horror",
 "address":" MIT, 390 Main St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3736780",
"fullName": "Lorraine Butler 2",
 "bookTitle": "The Time of the Seeds",
 "address":" New York University, 13 Oak Ave, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3736794",
"fullName": "Cedar Garry 3",
 "bookTitle": "The Madness Myth",
 "address":" CalTech, 45 Fifth Ave, New York, NY"},
{"type": "Author",
 "guid": "4995bc37367a8",
"fullName": "Sinclair Dale 2",
 "bookTitle": "The Night of the Dominator",
 "address":" New York University, 493 Bloom St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc37367bc",
"fullName": "Goldie Pickering 1",
 "bookTitle": "Menace of Day",
 "address":" University of Southampton, 216 First St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc37367cf",
"fullName": "Kaleigh Brooks 2",
 "bookTitle": "The Doom Fury",
 "address":" UC Santa Cruz, 189 Bloom St, London, UK"},
{"type": "Author",
 "guid": "4995bc37367e3",
"fullName": "Rain Joyce 3",
 "bookTitle": "The Day",
 "address":" New York University, 499 Dana St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc37367f7",
"fullName": "Merton Fillmore 3",
 "bookTitle": "Dreams of Menace",
 "address":" Santa Clara University, 98 Bloom St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc373680b",
"fullName": "Bekki Blunt 4",
 "bookTitle": "The Whispers of Day",
 "address":" UC Santa Cruz, 112 Lazaneo St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc373681f",
"fullName": "Godric Sommer 1",
 "bookTitle": "Men of Night",
 "address":" College University, 88 Lazaneo St, New York, NY"},
{"type": "Author",
 "guid": "4995bc3736832",
"fullName": "Thorburn Smith 4",
 "bookTitle": "Door of Horror",
 "address":" CalTech, 401 Elm St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3736846",
"fullName": "Frankie Giesen 3",
 "bookTitle": "The Jaws",
 "address":" Harvard, 117 Van Ness Blvd, London, UK"},
{"type": "Author",
 "guid": "4995bc373685a",
"fullName": "Brock Young 3",
 "bookTitle": "The Killer Key",
 "address":" New York University, 225 Van Ness Blvd, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc373686e",
"fullName": "Pleasance Mcloskey 1",
 "bookTitle": "Sound of Fear",
 "address":" College University, 331 Fifth Ave, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3736881",
"fullName": "Colin Hair 3",
 "bookTitle": "The Faceless Universe",
 "address":" Harvard, 185 Broadway Blvd, New York, NY"},
{"type": "Author",
 "guid": "4995bc3736895",
"fullName": "Jo Brindle 2",
 "bookTitle": "The Day Ice",
 "address":" UC Santa Cruz, 278 Fifth Ave, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc37368a9",
"fullName": "Loreen Buck 2",
 "bookTitle": "Underworld of Space",
 "address":" Harvard, 385 Main St, London, UK"},
{"type": "Author",
 "guid": "4995bc37368bd",
"fullName": "Darrell Reade 4",
 "bookTitle": "The Madness Seeds",
 "address":" UC Santa Cruz, 423 Dana St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc37368d0",
"fullName": "Delice Kimmons 2",
 "bookTitle": "The Fear of the Key",
 "address":" MIT, 161 First St, New York, NY"},
{"type": "Author",
 "guid": "4995bc37368e4",
"fullName": "Bettye Bode 1",
 "bookTitle": "The Thieves of Time",
 "address":" College University, 207 Main St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc37368f8",
"fullName": "Dillon Rowe 3",
 "bookTitle": "The Mind Wings",
 "address":" Foothill College, 374 Broadway Blvd, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc373690c",
"fullName": "Bennett Little 4",
 "bookTitle": "The Day Nemesis",
 "address":" MIT, 129 Lazaneo St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc373691f",
"fullName": "Bevis Powers 4",
 "bookTitle": "The Horror of Madness",
 "address":" Santa Clara University, 68 Oak Ave, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3736933",
"fullName": "Perce Pennington 3",
 "bookTitle": "The Massacre",
 "address":" New York University, 432 Bloom St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3736947",
"fullName": "America Thigpen 4",
 "bookTitle": "The Long Suns",
 "address":" University of Southampton, 217 University Loop, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc373695b",
"fullName": "Lyndsea Roberts 4",
 "bookTitle": "The Keeper",
 "address":" UC Santa Cruz, 153 Fifth Ave, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc373696f",
"fullName": "Loreen Buck 1",
 "bookTitle": "The Space of the Devil",
 "address":" CalTech, 65 University Loop, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3736983",
"fullName": "Unique Whitten 1",
 "bookTitle": "Infinity of Night",
 "address":" University of Southampton, 238 Dana St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3736997",
"fullName": "Bernadine Raub 4",
 "bookTitle": "The Menace of the Ark",
 "address":" London University, 369 Dana St, London, UK"},
{"type": "Author",
 "guid": "4995bc37369b2",
"fullName": "Gabe Milliron 4",
 "bookTitle": "The Machines",
 "address":" UC Santa Cruz, 331 University Loop, London, UK"},
{"type": "Author",
 "guid": "4995bc37369c6",
"fullName": "Ronda Higgens 2",
 "bookTitle": "Spiders of Death",
 "address":" Foothill College, 496 Castro St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc37369da",
"fullName": "Oscar Camp 2",
 "bookTitle": "The Day of the Computers",
 "address":" Santa Clara University, 292 Fifth Ave, New York, NY"},
{"type": "Author",
 "guid": "4995bc37369ed",
"fullName": "Hudson Cable 4",
 "bookTitle": "The Fury of the Angel",
 "address":" Stanford University, 116 Oak Ave, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3736a01",
"fullName": "Willis Costello 4",
 "bookTitle": "The Ghosts of Day",
 "address":" Foothill College, 370 Castro St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3736a15",
"fullName": "Douglas Bennett 3",
 "bookTitle": "The Universe",
 "address":" New York University, 74 University Loop, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3736a29",
"fullName": "Chonsie Conkle 1",
 "bookTitle": "The Seas of Fear",
 "address":" Santa Clara University, 479 Main St, London, UK"},
{"type": "Author",
 "guid": "4995bc3736a3c",
"fullName": "Lalage Schmidt 3",
 "bookTitle": "The Fear of the Awakening",
 "address":" CalTech, 415 Elm St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3736a50",
"fullName": "Patton Kooser 1",
 "bookTitle": "The Madness Nightmares",
 "address":" Stanford University, 38 University Loop, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3736a64",
"fullName": "Mya Eckert 3",
 "bookTitle": "The Tenth Web",
 "address":" Harvard, 89 Dana St, New York, NY"},
{"type": "Author",
 "guid": "4995bc3736a78",
"fullName": "Kayleen Trout 2",
 "bookTitle": "The Riders",
 "address":" London University, 355 Second St, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3736a8c",
"fullName": "Tawnie Vorrasi 2",
 "bookTitle": "The Runaway Gods",
 "address":" College University, 183 Elm St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3736aa0",
"fullName": "Marian Gearhart 4",
 "bookTitle": "The Pyramids of Death",
 "address":" UC Santa Cruz, 176 First St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3736ab4",
"fullName": "York Merryman 2",
 "bookTitle": "The Horns",
 "address":" New York University, 154 Castro St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3736ac8",
"fullName": "Dene Fair 1",
 "bookTitle": "The Menace Pyramid",
 "address":" MIT, 226 First St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3736adb",
"fullName": "Konnor Wells 4",
 "bookTitle": "Planet of Death",
 "address":" UC Santa Cruz, 94 Fifth Ave, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3736aef",
"fullName": "Chanel Boyd 4",
 "bookTitle": "The Horror Alien",
 "address":" CalTech, 125 Broadway Blvd, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3736b03",
"fullName": "Crispian Nickolson 2",
 "bookTitle": "The Impossible Armageddon",
 "address":" CalTech, 67 Oak Ave, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3736b1d",
"fullName": "Elouise Langston 3",
 "bookTitle": "The Doom of the Night",
 "address":" New York University, 48 University Loop, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3736b33",
"fullName": "Eliza Ropes 4",
 "bookTitle": "The Mirror",
 "address":" CalTech, 158 University Loop, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3736b46",
"fullName": "Raynard Peters 3",
 "bookTitle": "Child of Fear",
 "address":" MIT, 385 Lazaneo St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3736b5a",
"fullName": "Kaylynn Herndon 4",
 "bookTitle": "The Reign",
 "address":" Stanford University, 237 Van Ness Blvd, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3736b6e",
"fullName": "Priscilla Dean 4",
 "bookTitle": "The Space of the Horn",
 "address":" CalTech, 317 First St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3736b81",
"fullName": "Leighton Wickes 3",
 "bookTitle": "Pyramids of Menace",
 "address":" Springfield University, 313 Oak Ave, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3736b9c",
"fullName": "Anneka Gist 3",
 "bookTitle": "The God",
 "address":" Foothill College, 6 University Loop, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3736bb0",
"fullName": "Roseanne Rowley 2",
 "bookTitle": "The Horror of the Ice",
 "address":" Harvard, 253 First St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3736bc4",
"fullName": "Brandi Bauerle 1",
 "bookTitle": "The Children of Madness",
 "address":" Foothill College, 497 First St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3736bd8",
"fullName": "Kaitlyn Paul 3",
 "bookTitle": "The Mind Massacre",
 "address":" College University, 490 Lazaneo St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3736beb",
"fullName": "Silvester Mcfall 3",
 "bookTitle": "The Fear Child",
 "address":" CalTech, 348 Broadway Blvd, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3736bff",
"fullName": "Woodrow Fleming 2",
 "bookTitle": "The Empty Fear",
 "address":" Springfield University, 340 First St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3736c13",
"fullName": "Wynonna Erskine 3",
 "bookTitle": "Cave of Night",
 "address":" UC Santa Cruz, 37 Castro St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3736c27",
"fullName": "Lawrie Toyley 2",
 "bookTitle": "The Horror City",
 "address":" Stanford University, 172 University Loop, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3736c3b",
"fullName": "Breana Bastion 3",
 "bookTitle": "The Doomed Whisper",
 "address":" London University, 157 Lazaneo St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3736c4e",
"fullName": "Delice Kimmons 2",
 "bookTitle": "The Space of the Leisure",
 "address":" Stanford University, 308 Bloom St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3736c62",
"fullName": "Sybella Henley 2",
 "bookTitle": "The Armageddon",
 "address":" University of Southampton, 314 Lazaneo St, New York, NY"},
{"type": "Author",
 "guid": "4995bc3736c76",
"fullName": "Sebastian Stone 2",
 "bookTitle": "The Stone",
 "address":" Springfield University, 348 Second St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3736c8a",
"fullName": "Perdita Casteel 2",
 "bookTitle": "The Space Alien",
 "address":" Stanford University, 38 Castro St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3736c9e",
"fullName": "Lyndsea Roberts 4",
 "bookTitle": "The Fear Paradise",
 "address":" New York University, 433 Second St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3736cb2",
"fullName": "Reanna Meyers 2",
 "bookTitle": "Image of Menace",
 "address":" MIT, 452 Second St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3736cc6",
"fullName": "Paul Parrish 4",
 "bookTitle": "The Death Angels",
 "address":" MIT, 468 Castro St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3736cda",
"fullName": "Eldred West 2",
 "bookTitle": "The Time of the Mirror",
 "address":" College University, 420 Bloom St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3736ced",
"fullName": "Tawnie Vorrasi 2",
 "bookTitle": "The Madness of the Horror",
 "address":" Michigan State University, 289 Lazaneo St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3736d01",
"fullName": "Vic Close 4",
 "bookTitle": "The Death of the Pyramid",
 "address":" New York University, 229 Main St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3736d15",
"fullName": "Shana Owen 4",
 "bookTitle": "The Killer Fury",
 "address":" London University, 438 First St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3736d29",
"fullName": "Lissa Tillson 1",
 "bookTitle": "The Fear Killers",
 "address":" Harvard, 100 Castro St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3736d3d",
"fullName": "Gabriel Cherry 1",
 "bookTitle": "The Reign of Madness",
 "address":" Stanford University, 319 Elm St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3736d51",
"fullName": "Willis Costello 4",
 "bookTitle": "The Horror Angel",
 "address":" UC Santa Cruz, 411 Van Ness Blvd, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3736d65",
"fullName": "Seward Romanoff 2",
 "bookTitle": "The Day Monster",
 "address":" University of Southampton, 371 University Loop, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3736d80",
"fullName": "Cornelius Metzer 3",
 "bookTitle": "Hive of Menace",
 "address":" CalTech, 99 Second St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3736d94",
"fullName": "Pansy Summy 4",
 "bookTitle": "The Day Thieves",
 "address":" New York University, 419 University Loop, London, UK"},
{"type": "Author",
 "guid": "4995bc3736da8",
"fullName": "Jaymes Cox 3",
 "bookTitle": "The Fear of the Minds",
 "address":" MIT, 54 First St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3736dbc",
"fullName": "Pansy Summy 4",
 "bookTitle": "The Runaway Gods",
 "address":" Foothill College, 85 Elm St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3736dcf",
"fullName": "August Feufer 2",
 "bookTitle": "God of Doom",
 "address":" Michigan State University, 237 Second St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3736de3",
"fullName": "Raphael Wilks 4",
 "bookTitle": "The Creature",
 "address":" College University, 46 Main St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3736df7",
"fullName": "Colin Hair 4",
 "bookTitle": "The Horror Child",
 "address":" Foothill College, 244 Castro St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3736e0a",
"fullName": "Colten Stange 2",
 "bookTitle": "Dreams of Menace",
 "address":" CalTech, 212 Fifth Ave, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3736e1e",
"fullName": "Chonsie Conkle 3",
 "bookTitle": "The Menace Carnival",
 "address":" CalTech, 470 Broadway Blvd, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc3736e32",
"fullName": "Kaleigh Brooks 4",
 "bookTitle": "The Fury Massacre",
 "address":" New York University, 361 Lazaneo St, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc3736e46",
"fullName": "Kaye Harding 3",
 "bookTitle": "The Doom of the Battlefield",
 "address":" Harvard, 246 Castro St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3736e59",
"fullName": "Kendal Ritter 1",
 "bookTitle": "The Whisper Faces",
 "address":" Foothill College, 80 Fifth Ave, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3736e6d",
"fullName": "Eleanor Bennett 4",
 "bookTitle": "The Angels of Madness",
 "address":" CalTech, 263 Oak Ave, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3736e81",
"fullName": "Lindsey Straub 3",
 "bookTitle": "The Doom of the Jaws",
 "address":" MIT, 146 Van Ness Blvd, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3736e95",
"fullName": "Fawn Carr 1",
 "bookTitle": "Door of Space",
 "address":" Stanford University, 22 Oak Ave, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3736ea9",
"fullName": "Deshawn Pyle 3",
 "bookTitle": "The Secret",
 "address":" MIT, 180 University Loop, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3736ebd",
"fullName": "Virgee Mcdonald 1",
 "bookTitle": "The Space Mists",
 "address":" MIT, 288 Lazaneo St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3736ed0",
"fullName": "Tex Koster 4",
 "bookTitle": "The Time Ambassador",
 "address":" Santa Clara University, 372 Main St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3736ee4",
"fullName": "Sorrel Dugmore 2",
 "bookTitle": "The Robber",
 "address":" Stanford University, 390 Oak Ave, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc3736ef8",
"fullName": "Beverly Harrold 2",
 "bookTitle": "The Planet of Doom",
 "address":" Harvard, 289 Fifth Ave, London, UK"},
{"type": "Author",
 "guid": "4995bc3736f0c",
"fullName": "Webster Jelliman 4",
 "bookTitle": "The Madness Masters",
 "address":" Foothill College, 316 First St, London, UK"},
{"type": "Author",
 "guid": "4995bc3736f24",
"fullName": "Tracee Martin 4",
 "bookTitle": "The Minds of Fury",
 "address":" UC Santa Cruz, 272 First St, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3736f3b",
"fullName": "Delice Kimmons 2",
 "bookTitle": "The Warrior of Day",
 "address":" University of Southampton, 364 University Loop, London, UK"},
{"type": "Author",
 "guid": "4995bc3736f5c",
"fullName": "Godric Sommer 1",
 "bookTitle": "Robots of Menace",
 "address":" MIT, 251 University Loop, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3736f70",
"fullName": "Tatianna Johns 3",
 "bookTitle": "The Death of the Riders",
 "address":" Santa Clara University, 416 Oak Ave, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3736f8c",
"fullName": "Herbert Durstine 1",
 "bookTitle": "The Space of the Devil",
 "address":" New York University, 384 Fifth Ave, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3736fa0",
"fullName": "Myron Rhodes 4",
 "bookTitle": "The Devil",
 "address":" London University, 8 Castro St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3736fb3",
"fullName": "Hank Hughes 2",
 "bookTitle": "The Machine of Doom",
 "address":" Springfield University, 42 First St, London, UK"},
{"type": "Author",
 "guid": "4995bc3736fc7",
"fullName": "Fox Omara 2",
 "bookTitle": "The Night of the Leisure",
 "address":" CalTech, 468 Fifth Ave, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3736fdb",
"fullName": "Dyan Bratton 1",
 "bookTitle": "The Child of Space",
 "address":" Springfield University, 463 Castro St, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3736fef",
"fullName": "Eleanor Bennett 4",
 "bookTitle": "Machine of Night",
 "address":" Springfield University, 301 Second St, London, UK"},
{"type": "Author",
 "guid": "4995bc3737002",
"fullName": "Seward Romanoff 3",
 "bookTitle": "The Secret Pit",
 "address":" College University, 353 University Loop, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc3737016",
"fullName": "Erick Sulyard 1",
 "bookTitle": "Whispers of Day",
 "address":" Harvard, 223 Castro St, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc373702a",
"fullName": "Godric Sommer 3",
 "bookTitle": "The Menace Mist",
 "address":" London University, 260 Van Ness Blvd, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc373703d",
"fullName": " 2",
 "bookTitle": "The Horror Robot",
 "address":" New York University, 499 Castro St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc3737055",
"fullName": "Porsche Gilman 3",
 "bookTitle": "The Time Suns",
 "address":" CalTech, 336 First St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc3737069",
"fullName": "Phineas Poehl 1",
 "bookTitle": "Ark of Day",
 "address":" London University, 162 Bloom St, Wichita, KS"},
{"type": "Author",
 "guid": "4995bc373707d",
"fullName": "Tylar Monahan 3",
 "bookTitle": "The Menace of the Robbers",
 "address":" Springfield University, 498 Broadway Blvd, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3737091",
"fullName": "Harvey Wardle 3",
 "bookTitle": "Mutants of Night",
 "address":" MIT, 58 Bloom St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc37370a5",
"fullName": "Thea Sullivan 1",
 "bookTitle": "The Night of the Dominator",
 "address":" Santa Clara University, 443 Lazaneo St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc37370b9",
"fullName": "Brandie Tue 2",
 "bookTitle": "The Fury Secret",
 "address":" CalTech, 130 Lazaneo St, London, UK"},
{"type": "Author",
 "guid": "4995bc37370cd",
"fullName": "Tessa Pullman 3",
 "bookTitle": "The Menace of the Pit",
 "address":" CalTech, 393 Oak Ave, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc37370e0",
"fullName": "Freeman Marcotte 4",
 "bookTitle": "The Jaws of Night",
 "address":" Harvard, 288 Second St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc37370f4",
"fullName": "Tex Koster 2",
 "bookTitle": "The Madness Attack",
 "address":" College University, 233 Fifth Ave, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3737108",
"fullName": "Barret Lalty 2",
 "bookTitle": "The Unearthly Assassin",
 "address":" London University, 399 Elm St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc373711c",
"fullName": "Timotha Weeks 4",
 "bookTitle": "The Death Face",
 "address":" Stanford University, 302 Lazaneo St, Cambridge, MA"},
{"type": "Author",
 "guid": "4995bc3737130",
"fullName": "Tybalt Hahn 2",
 "bookTitle": "Masque of Space",
 "address":" New York University, 108 Elm St, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc3737144",
"fullName": "Dewayne Patton 3",
 "bookTitle": "The Armageddon",
 "address":" Harvard, 83 Bloom St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc3737158",
"fullName": "Tommie Keilbach 4",
 "bookTitle": "The First Cave",
 "address":" College University, 124 First St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3737196",
"fullName": "Boyce Baughman 3",
 "bookTitle": "The Stone of Madness",
 "address":" Stanford University, 366 Second St, London, UK"},
{"type": "Author",
 "guid": "4995bc37371ac",
"fullName": "Godric Sommer 3",
 "bookTitle": "Killer of Night",
 "address":" London University, 489 Oak Ave, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc37371c1",
"fullName": "Kenelm Tomco 2",
 "bookTitle": "The Fury of the Master",
 "address":" UC Santa Cruz, 142 Bloom St, London, UK"},
{"type": "Author",
 "guid": "4995bc37371d4",
"fullName": "Wendell Osteen 3",
 "bookTitle": "The Fear Awakening",
 "address":" New York University, 419 First St, Santa Clara, CA"},
{"type": "Author",
 "guid": "4995bc37371eb",
"fullName": "Antwan Biery 4",
 "bookTitle": "The Day of the Invasion",
 "address":" Santa Clara University, 445 Fifth Ave, Cupertino, CA"},
{"type": "Author",
 "guid": "4995bc37371ff",
"fullName": "Stacy Moffat 4",
 "bookTitle": "Door of Horror",
 "address":" College University, 282 Oak Ave, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc3737213",
"fullName": "Alyx Hincken 3",
 "bookTitle": "The Day Nemesis",
 "address":" CalTech, 235 University Loop, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3737227",
"fullName": "Silvester Mcfall 1",
 "bookTitle": "The Monster",
 "address":" Springfield University, 86 Lazaneo St, Southampton, UK"},
{"type": "Author",
 "guid": "4995bc373723a",
"fullName": "Janella Warner 2",
 "bookTitle": "The Madness Man",
 "address":" Stanford University, 96 Dana St, Ann Arbor, MI"},
{"type": "Author",
 "guid": "4995bc373724e",
"fullName": "Braeden Seidner 2",
 "bookTitle": "The Menace Pit",
 "address":" Santa Clara University, 154 Bloom St, New York, NY"},
{"type": "Author",
 "guid": "4995bc3737263",
"fullName": "Cyrus Hatfield 2",
 "bookTitle": "The Night Nightmares",
 "address":" Michigan State University, 46 Van Ness Blvd, St. Louis, MO"},
{"type": "Author",
 "guid": "4995bc3737277",
"fullName": "Carly Reiss 4",
 "bookTitle": "The Spiders of Fear",
 "address":" CalTech, 420 Dana St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc373728b",
"fullName": "Anselm Swift 4",
 "bookTitle": "The Final Time",
 "address":" Stanford University, 203 Main St, Seattle, WA"},
{"type": "Author",
 "guid": "4995bc373729f",
"fullName": "Dallas Hawker 2",
 "bookTitle": "The Day Galaxy",
 "address":" CalTech, 195 First St, San Francisco, CA"},
{"type": "Author",
 "guid": "4995bc37372b3",
"fullName": "Horatio Hutton 1",
 "bookTitle": "The Time Ambassador",
 "address":" Springfield University, 183 Castro St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc37372c7",
"fullName": "Trev Hallauer 1",
 "bookTitle": "The Final Time",
 "address":" New York University, 51 Broadway Blvd, Los Angeles, CA"},
{"type": "Author",
 "guid": "4995bc37372db",
"fullName": "Sharyn Quinn 4",
 "bookTitle": "The Reign of Day",
 "address":" Foothill College, 493 Lazaneo St, Palo Alto, CA"},
{"type": "Author",
 "guid": "4995bc37372ee",
"fullName": "Raphael Wilks 1",
 "bookTitle": "The Masque of Death",
 "address":" New York University, 96 Oak Ave, Los Angeles, CA"}];


/* >>>>>>>>>> BEGIN source/fixtures/sample.js */
//require('core') ;
//var Sample = new Object();
// Sample.File= new Object();
// Sample.File.FIXTURES =[];
// 
// Sample.File.FIXTURES = [
// // files
// { guid: '10', name: 'Home', url: '/emily_parker', isDirectory: true, parent: null, children: 'Collection'},
// { guid: '11', name: 'Documents', fileType: 'documents', url: '/emily_parker/Documents', isDirectory: true, parent: '10', children: 'Collection', createdAt: 'June 15, 2007', modifiedAt: 'October 21, 2007', filetype: 'directory', isShared: false},
// { guid: '137',name: 'Library', fileType: 'library', url: '/emily_parker/Library', isDirectory: true, parent: '10', children: 'Collection', createdAt: 'June 15, 2007', modifiedAt: 'October 21, 2007', filetype: 'directory', isShared: false},
// { guid: '12', name: 'Movies', fileType: 'movies', url: '/emily_parker/Movies', isDirectory: true, parent: '10', children: 'Collection', createdAt: 'June 15, 2007', modifiedAt: 'June 15, 2007', filetype: 'directory', isShared: true, sharedAt: 'October 15, 2007', sharedUntil: 'March 31, 2008', sharedUrl: '2fhty', isPasswordRequired: true},
// { guid: '134',name: 'Music', fileType: 'music', url: '/emily_parker/Music', isDirectory: true, parent: '10', children: 'Collection', createdAt: 'June 15, 2007', modifiedAt: 'June 15, 2007', filetype: 'directory', isShared: true, sharedAt: 'October 15, 2007', sharedUntil: 'March 31, 2008', sharedUrl: '2fhty', isPasswordRequired: true},
// { guid: '135',name: 'Pictures', fileType: 'pictures', url: '/emily_parker/Pictures', isDirectory: true, parent: '10', children: 'Collection', createdAt: 'June 15, 2007', modifiedAt: 'June 15, 2007', filetype: 'directory', isShared: true, sharedAt: 'October 15, 2007', sharedUntil: 'March 31, 2008', sharedUrl: '2fhty', isPasswordRequired: true},
// { guid: '13', name: 'Auto Insurance', fileType: 'folder', url: '/emily_parker/Documents/Auto%20Insurance', isDirectory: true, parent: '11', children: 'Collection', createdAt: 'June 15, 2007', modifiedAt: 'October 21, 2007', filetype: 'directory', isShared: false},
// { guid: '14', name: 'Birthday Invitation.pdf', fileType: 'file', url: '/emily_parker/Documents/Birthday%20Invitation', isDirectory: false, parent: '11', createdAt: 'October 17, 2007', modifiedAt: 'October 21, 2007', filetype: 'pdf', isShared: false},
// { guid: '136', name: 'Software', fileType: 'software', url: '/emily_parker/Software', isDirectory: true, parent: '10', children: 'Collection', createdAt: 'June 15, 2007', modifiedAt: 'June 15, 2007', filetype: 'directory', isShared: true, sharedAt: 'October 15, 2007', sharedUntil: 'March 31, 2008', sharedUrl: '2fhty', isPasswordRequired: true}
// ];

/* >>>>>>>>>> BEGIN source/models/record_attribute.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

sc_require('models/record');

/** @class

  A RecordAttribute describes a single attribute on a record.  It is used to
  generate computed properties on records that can automatically convert data
  types and verify data.
  
  When defining an attribute on an SC.Record, you can configure it this way: 
  
  {{{
    title: SC.Record.attr(String, { 
      defaultValue: 'Untitled',
      isRequired: YES|NO
    })
  }}}
  
  In addition to having predefined transform types, there is also a way to 
  set a computed relationship on an attribute. A typical example of this would
  be if you have record with a parentGuid attribute, but are not able to 
  determine which record type to map to before looking at the guid (or any
  other attributes). To set up such a computed property, you can attach a 
  function in the attribute definition of the SC.Record subclass:
  
  {{{
    relatedToComputed: SC.Record.toOne(function() {
      return (this.readAttribute('relatedToComputed').indexOf("foo")==0) ? MyApp.Foo : MyApp.Bar;
    })
  }}}
  
  Notice that we are not using .get() to avoid another transform which would 
  trigger an infinite loop.
  
  You usually will not work with RecordAttribute objects directly, though you
  may extend the class in any way that you like to create a custom attribute.

  A number of default RecordAttribute types are defined on the SC.Record.
  
  @extends SC.Object
  @since SproutCore 1.0
*/
SC.RecordAttribute = SC.Object.extend(
  /** @scope SC.RecordAttribute.prototype */ {

  /**
    The default value.  If attribute is null or undefined, this default value
    will be substituted instead.  Note that defaultValues are not converted
    so the value should be in the output type expected by the attribute.
    
    @property {Object}
  */
  defaultValue: null,
  
  /**
    The attribute type.  Must be either an object class or a property path
    naming a class.  The built in handler allows all native types to pass 
    through, converts records to ids and dates to UTF strings.
    
    If you use the attr() helper method to create a RecordAttribute instance,
    it will set this property to the first parameter you pass.
    
    @property {Object|String}
  */
  type: String,
  
  /**
    The underlying attribute key name this attribute should manage.  If this
    property is left empty, then the key will be whatever property name this
    attribute assigned to on the record.  If you need to provide some kind
    of alternate mapping, this provides you a way to override it.
    
    @property {String}
  */
  key: null,
  
  /**
    If YES, then the attribute is required and will fail validation unless
    the property is set to a non-null or undefined value.
    
    @property {Boolean}
  */
  isRequired: NO,
  
  /**
    If NO then attempts to edit the attribute will be ignored.
    
    @property {Boolean}
  */
  isEditable: YES,  
  
  /**
    If set when using the Date format, expect the ISO8601 date format.  
    This is the default.
    
    @property {Boolean}
  */
  useIsoDate: YES,
  
  /**
    Can only be used for toOne or toMany relationship attributes. If YES,
    this flag will ensure that any related objects will also be marked
    dirty when this record dirtied. 
    
    Useful when you might have multiple related objects that you want to 
    consider in an 'aggregated' state. For instance, by changing a child
    object (image) you might also want to automatically mark the parent 
    (album) dirty as well.
    
    @property {Boolean}
  */
  aggregate: NO,
  
  // ..........................................................
  // HELPER PROPERTIES
  // 
  
  /**
    Returns the type, resolved to a class.  If the type property is a regular
    class, returns the type unchanged.  Otherwise attempts to lookup the 
    type as a property path.
    
    @property {Object}
  */
  typeClass: function() {
    var ret = this.get('type');
    if (SC.typeOf(ret) === SC.T_STRING) ret = SC.objectForPropertyPath(ret);
    return ret ;
  }.property('type').cacheable(),
  
  /**
    Finds the transform handler. 
    
    @property {Function}
  */
  transform: function() {
    var klass      = this.get('typeClass') || String,
        transforms = SC.RecordAttribute.transforms,
        ret ;
        
    // walk up class hierarchy looking for a transform handler
    while(klass && !(ret = transforms[SC.guidFor(klass)])) {
      // check if super has create property to detect SC.Object's
      if(klass.superclass.hasOwnProperty('create')) klass = klass.superclass ;
      // otherwise return the function transform handler
      else klass = SC.T_FUNCTION ;
    }
    
    return ret ;
  }.property('typeClass').cacheable(),
  
  // ..........................................................
  // LOW-LEVEL METHODS
  // 
  
  /** 
    Converts the passed value into the core attribute value.  This will apply 
    any format transforms.  You can install standard transforms by adding to
    the SC.RecordAttribute.transforms hash.  See 
    SC.RecordAttribute.registerTransform() for more.
    
    @param {SC.Record} record the record instance
    @param {String} key the key used to access this attribute on the record
    @param {Object} value the property value
    @returns {Object} attribute value
  */
  toType: function(record, key, value) {
    var transform = this.get('transform'),
        type      = this.get('typeClass');
    
    if (transform && transform.to) {
      value = transform.to(value, this, type, record, key) ;
    }
    return value ;
  },

  /** 
    Converts the passed value from the core attribute value.  This will apply 
    any format transforms.  You can install standard transforms by adding to
    the SC.RecordAttribute.transforms hash.  See 
    SC.RecordAttribute.registerTransform() for more.

    @param {SC.Record} record the record instance
    @param {String} key the key used to access this attribute on the record
    @param {Object} value the property value
    @returns {Object} attribute value
  */
  fromType: function(record, key, value) {
    var transform = this.get('transform'),
        type      = this.get('typeClass');
    
    if (transform && transform.from) {
      value = transform.from(value, this, type, record, key);
    }
    return value;
  },

  /**
    The core handler.  Called from the property.
    
    @param {SC.Record} record the record instance
    @param {String} key the key used to access this attribute on the record
    @param {Object} value the property value if called as a setter
    @returns {Object} property value
  */
  call: function(record, key, value) {
    var attrKey = this.get('key') || key, nvalue;
    
    if (value !== undefined) {

      // careful: don't overwrite value here.  we want the return value to 
      // cache.
      nvalue = this.fromType(record, key, value) ; // convert to attribute.
      record.writeAttribute(attrKey, nvalue); 
    } else {
      value = record.readAttribute(attrKey);
      if (SC.none(value) && (value = this.get('defaultValue'))) {
        if (typeof value === SC.T_FUNCTION) {
          value = this.defaultValue(record, key, this);
          // write default value so it doesn't have to be executed again
          if(record.attributes()) record.writeAttribute(attrKey, value, true);
        }
      } else value = this.toType(record, key, value);
    }
    
    return value ;
  },

  // ..........................................................
  // INTERNAL SUPPORT
  // 
  
  /** @private - Make this look like a property so that get() will call it. */
  isProperty: YES,
  
  /** @private - Make this look cacheable */
  isCacheable: YES,
  
  /** @private - needed for KVO property() support */
  dependentKeys: [],
  
  /** @private */
  init: function() {
    arguments.callee.base.apply(this,arguments);
    // setup some internal properties needed for KVO - faking 'cacheable'
    this.cacheKey = "__cache__" + SC.guidFor(this) ;
    this.lastSetValueKey = "__lastValue__" + SC.guidFor(this) ;
  }
  
}) ;

// ..........................................................
// CLASS METHODS
// 

/**
  The default method used to create a record attribute instance.  Unlike 
  create(), takes an attributeType as the first parameter which will be set 
  on the attribute itself.  You can pass a string naming a class or a class
  itself.
  
  @param {Object|String} attributeType the assumed attribute type
  @param {Hash} opts optional additional config options
  @returns {SC.RecordAttribute} new instance
*/
SC.RecordAttribute.attr = function(attributeType, opts) {
  if (!opts) opts = {} ;
  if (!opts.type) opts.type = attributeType || String ;
  return this.create(opts);
};

/** @private
  Hash of registered transforms by class guid. 
*/
SC.RecordAttribute.transforms = {};

/**
  Call to register a transform handler for a specific type of object.  The
  object you pass can be of any type as long as it responds to the following
  methods:

  | *to(value, attr, klass, record, key)* | converts the passed value (which will be of the class expected by the attribute) into the underlying attribute value |
  | *from(value, attr, klass, record, key)* | converts the underyling attribute value into a value of the class |
  
  @param {Object} klass the type of object you convert
  @param {Object} transform the transform object
  @returns {SC.RecordAttribute} receiver
*/
SC.RecordAttribute.registerTransform = function(klass, transform) {
  SC.RecordAttribute.transforms[SC.guidFor(klass)] = transform;
};

// ..........................................................
// STANDARD ATTRIBUTE TRANSFORMS
// 

// Object, String, Number just pass through.

/** @private - generic converter for Boolean records */
SC.RecordAttribute.registerTransform(Boolean, {
  /** @private - convert an arbitrary object value to a boolean */
  to: function(obj) {
    return SC.none(obj) ? null : !!obj;
  }
});

/** @private - generic converter for Numbers */
SC.RecordAttribute.registerTransform(Number, {
  /** @private - convert an arbitrary object value to a Number */
  to: function(obj) {
    return SC.none(obj) ? null : Number(obj) ;
  }
});

/** @private - generic converter for Strings */
SC.RecordAttribute.registerTransform(String, {
  /** @private - 
    convert an arbitrary object value to a String 
    allow null through as that will be checked separately
  */
  to: function(obj) {
    if (!(typeof obj === SC.T_STRING) && !SC.none(obj) && obj.toString) {
      obj = obj.toString();
    }
    return obj;
  }
});

/** @private - generic converter for Array */
SC.RecordAttribute.registerTransform(Array, {
  /** @private - check if obj is an array
  */
  to: function(obj) {
    if (!SC.isArray(obj) && !SC.none(obj)) {
      obj = [];
    }
    return obj;
  }
});

/** @private - generic converter for Object */
SC.RecordAttribute.registerTransform(Object, {
  /** @private - check if obj is an object */
  to: function(obj) {
    if (!(typeof obj === 'object') && !SC.none(obj)) {
      obj = {};
    }
    return obj;
  }
});

/** @private - generic converter for SC.Record-type records */
SC.RecordAttribute.registerTransform(SC.Record, {

  /** @private - convert a record id to a record instance */
  to: function(id, attr, recordType, parentRecord) {
    var store = parentRecord.get('store');
    if (SC.none(id) || (id==="")) return null;
    else return store.find(recordType, id);
  },
  
  /** @private - convert a record instance to a record id */
  from: function(record) { return record ? record.get('id') : null; }
});

/** @private - generic converter for transforming computed record attributes */
SC.RecordAttribute.registerTransform(SC.T_FUNCTION, {

  /** @private - convert a record id to a record instance */
  to: function(id, attr, recordType, parentRecord) {
    recordType = recordType.apply(parentRecord);
    var store = parentRecord.get('store');
    return store.find(recordType, id);
  },
  
  /** @private - convert a record instance to a record id */
  from: function(record) { return record.get('id'); }
});

/** @private - generic converter for Date records */
SC.RecordAttribute.registerTransform(Date, {

  /** @private - convert a string to a Date */
  to: function(str, attr) {
    var ret ;
    
    if (attr.get('useIsoDate')) {
      var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
             "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\\.([0-9]+))?)?" +
             "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?",
          d      = str.toString().match(new RegExp(regexp)),
          offset = 0,
          date   = new Date(d[1], 0, 1),
          time ;

      if (d[3]) { date.setMonth(d[3] - 1); }
      if (d[5]) { date.setDate(d[5]); }
      if (d[7]) { date.setHours(d[7]); }
      if (d[8]) { date.setMinutes(d[8]); }
      if (d[10]) { date.setSeconds(d[10]); }
      if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
      if (d[14]) {
         offset = (Number(d[16]) * 60) + Number(d[17]);
         offset *= ((d[15] == '-') ? 1 : -1);
      }

      offset -= date.getTimezoneOffset();
      time = (Number(date) + (offset * 60 * 1000));
      
      ret = new Date();
      ret.setTime(Number(time));
    } else ret = new Date(Date.parse(str));
    return ret ;
  },
  
  _dates: {},

  _zeropad: function(num) { 
    return ((num<0) ? '-' : '') + ((num<10) ? '0' : '') + Math.abs(num); 
  },
  
  /** @private - convert a date to a string */
  from: function(date) { 
    var ret = this._dates[date.getTime()];
    if (ret) return ret ; 
    
    // figure timezone
    var zp = this._zeropad,
        tz = 0-date.getTimezoneOffset()/60;
        
    tz = (tz === 0) ? 'Z' : '%@:00'.fmt(zp(tz));
    
    this._dates[date.getTime()] = ret = "%@-%@-%@T%@:%@:%@%@".fmt(
      zp(date.getFullYear()),
      zp(date.getMonth()+1),
      zp(date.getDate()),
      zp(date.getHours()),
      zp(date.getMinutes()),
      zp(date.getSeconds()),
      tz) ;
    
    return ret ;
  }
});

if (SC.DateTime && !SC.RecordAttribute.transforms[SC.guidFor(SC.DateTime)]) {
  /**
    Registers a transform to allow SC.DateTime to be used as a record attribute,
    ie SC.Record.attr(SC.DateTime);
  
    Because SC.RecordAttribute is in the datastore framework and SC.DateTime in
    the foundation framework, and we don't know which framework is being loaded
    first, this chunck of code is duplicated in both frameworks.
  
    IF YOU EDIT THIS CODE MAKE SURE YOU COPY YOUR CHANGES to record_attribute.js. 
  */

  SC.RecordAttribute.registerTransform(SC.DateTime, {
  
    /** @private
      Convert a String to a DateTime
    */
    to: function(str, attr) {
      if (SC.none(str) || SC.instanceOf(str, SC.DateTime)) return str;
      var format = attr.get('format');
      return SC.DateTime.parse(str, format ? format : SC.DateTime.recordFormat);
    },
  
    /** @private
      Convert a DateTime to a String
    */
    from: function(dt, attr) {
      if (SC.none(dt)) return dt;
      var format = attr.get('format');
      return dt.toFormattedString(format ? format : SC.DateTime.recordFormat);
    }
  });
  
}

/* >>>>>>>>>> BEGIN source/models/fetched_attribute.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

sc_require('models/record');
sc_require('models/record_attribute');

/** @class

  Describes a single attribute that is fetched dynamically from the server
  when you request it.  Normally getting a property value with this attribute
  applied will cause call the find() method on the record store passing
  the attribute record type as the query key along with the property value,
  owner record, and property key name as parameters. 
  
  The DataSource you hook up to your store must know how to load this kind 
  of relationship for this fetched property to work properly.
  
  The return value is usually an SC.RecordArray that will populate with the
  record data so that you can display it.
  
  @extends SC.RecordAttribute
  @since SproutCore 1.0
*/
SC.FetchedAttribute = SC.RecordAttribute.extend(
  /** @scope SC.FetchedAttribute.prototype */ {

  /**
    Define the param key that will be passed to the findAll method on the
    store.  If null, the param will not be send.  Defaults to 'link'
    
    @property {String}
  */
  paramValueKey: 'link',

  /**
    Define the param key used to send the parent record.  If null the param
    will not be sent.  Defaults to 'owner'.
    
    @property {String}
  */
  paramOwnerKey: 'owner',
  
  /**
    Define the param key used to send the key name used to reference this 
    attribute.  If null, the param will not be sent.  Defaults to "rel"
    
    @property {String}
  */
  paramRelKey: 'rel',
  
  /**
    Optional query key to pass to findAll.  Otherwise type class will be 
    passed.
    
    @property {String}
  */
  queryKey: null,

  /** 
    Fetched attributes are not editable 
    
    @property {Boolean}
  */
  isEditable: NO,  
  
  // ..........................................................
  // LOW-LEVEL METHODS
  // 
  
  /**  @private - adapted for fetching. do findAll */
  toType: function(record, key, value) {
    var store = record.get('store');
    if (!store) return null ; // nothing to do
    
    var paramValueKey = this.get('paramValueKey'),
        paramOwnerKey = this.get('paramOwnerKey'),
        paramRelKey   = this.get('paramRelKey'),
        queryKey      = this.get('queryKey') || this.get('typeClass'),
        params        = {};

    // setup params for query
    if (paramValueKey) params[paramValueKey] = value ;
    if (paramOwnerKey) params[paramOwnerKey] = record ;
    if (paramRelKey)   params[paramRelKey]   = this.get('key') || key ;
    
    // make request - should return SC.RecordArray instance
    return store.findAll(queryKey, params);
  },

  /** @private - fetched attributes are read only. */
  fromType: function(record, key, value) {
    return value;
  }
  
}) ;


/* >>>>>>>>>> BEGIN source/models/many_attribute.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

sc_require('models/record');
sc_require('models/record_attribute');

/** @class
  
  ManyAttribute is a subclass of RecordAttribute and handles to-many 
  relationships.
  
  When setting ( .set() ) the value of a toMany attribute, make sure
  to pass in an array of SC.Record objects.
  
  There are many ways you can configure a ManyAttribute:
  
  {{{
    contacts: SC.Record.toMany('MyApp.Contact', { 
      inverse: 'group', // set the key used to represent the inverse 
      isMaster: YES|NO, // indicate whether changing this should dirty
      transform: function(), // transforms value <=> storeKey,
      isEditable: YES|NO, make editable or not,
      through: 'taggings' // set a relationship this goes through
    });
  }}}
  
  @extends SC.RecordAttribute
  @since SproutCore 1.0
*/
SC.ManyAttribute = SC.RecordAttribute.extend(
  /** @scope SC.ManyAttribute.prototype */ {
  
  /**
    Set the foreign key on content objects that represent the inversion of
    this relationship.  The inverse property should be a toOne() or toMany()
    relationship as well.  Modifying this many array will modify the inverse
    property as well.
    
    @property {String}
  */
  inverse: null,
  
  /**
    If YES then modifying this relationships will mark the owner record 
    dirty.    If set ot NO, then modifying this relationship will not alter
    this record.  You should use this property only if you have an inverse 
    property also set.  Only one of the inverse relationships should be marked
    as master so you can control which record should be committed.
    
    @property {Boolean}
  */
  isMaster: YES,
  
  /**
    If set and you have an inverse relationship, will be used to determine the
    order of an object when it is added to an array.  You can pass a function
    or an array of property keys.
    
    @property {Function|Array}
  */
  orderBy: null,
  
  // ..........................................................
  // LOW-LEVEL METHODS
  //
  
  /**  @private - adapted for to many relationship */
  toType: function(record, key, value) {
    var type      = this.get('typeClass'),
        attrKey   = this.get('key') || key,
        arrayKey  = SC.keyFor('__manyArray__', SC.guidFor(this)),
        ret       = record[arrayKey],
        rel;

    // lazily create a ManyArray one time.  after that always return the 
    // same object.
    if (!ret) {
      ret = SC.ManyArray.create({ 
        recordType:    type,
        record:        record,
        propertyName:  attrKey,
        manyAttribute: this
      });

      record[arrayKey] = ret ; // save on record
      rel = record.get('relationships');
      if (!rel) record.set('relationships', rel = []);
      rel.push(ret); // make sure we get notified of changes...

    }

    return ret;
  },
  
  /** @private - adapted for to many relationship */
  fromType: function(record, key, value) {
    var ret = [];
    
    if(!SC.isArray(value)) throw "Expects toMany attribute to be an array";
    
    var len = value.get('length');
    for(var i=0;i<len;i++) {
      ret[i] = value.objectAt(i).get('id');
    }
    
    return ret;
  },
  
  /**
    Called by an inverse relationship whenever the receiver is no longer part
    of the relationship.  If this matches the inverse setting of the attribute
    then it will update itself accordingly.

    You should never call this directly.
    
    @param {SC.Record} the record owning this attribute
    @param {String} key the key for this attribute
    @param {SC.Record} inverseRecord record that was removed from inverse
    @param {String} key key on inverse that was modified
    @returns {void}
  */
  inverseDidRemoveRecord: function(record, key, inverseRecord, inverseKey) {
    var manyArray = record.get(key);
    if (manyArray) {
      manyArray.removeInverseRecord(inverseRecord);
    }
  },
  
  /**
    Called by an inverse relationship whenever the receiver is added to the 
    inverse relationship.  This will set the value of this inverse record to 
    the new record.
    
    You should never call this directly.
    
    @param {SC.Record} the record owning this attribute
    @param {String} key the key for this attribute
    @param {SC.Record} inverseRecord record that was added to inverse
    @param {String} key key on inverse that was modified
    @returns {void}
  */
  inverseDidAddRecord: function(record, key, inverseRecord, inverseKey) {
    var manyArray = record.get(key);
    if (manyArray) {
      manyArray.addInverseRecord(inverseRecord);
    }
  }
  
});

/* >>>>>>>>>> BEGIN source/models/single_attribute.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

sc_require('models/record');
sc_require('models/record_attribute');

/** @class
  
  SingleAttribute is a subclass of RecordAttribute and handles to-one
  relationships.

  There are many ways you can configure a SingleAttribute:
  
  {{{
    group: SC.Record.toOne('MyApp.Group', { 
      inverse: 'contacts', // set the key used to represent the inverse 
      isMaster: YES|NO, // indicate whether changing this should dirty
      transform: function(), // transforms value <=> storeKey,
      isEditable: YES|NO, make editable or not
    });
  }}}
  
  @extends SC.RecordAttribute
  @since SproutCore 1.0
*/
SC.SingleAttribute = SC.RecordAttribute.extend(
  /** @scope SC.SingleAttribute.prototype */ {

  /**
    Specifies the property on the member record that represents the inverse
    of the current relationship.  If set, then modifying this relationship
    will also alter the opposite side of the relationship.
    
    @property {String}
  */
  inverse: null,
  
  /**
    If set, determines that when an inverse relationship changes whether this
    record should become dirty also or not.
    
    @property {Boolean}
  */
  isMaster: YES,
  
  
  /**
    @private - implements support for handling inverse relationships.
  */
  call: function(record, key, newRec) {
    var attrKey = this.get('key') || key,
        inverseKey, isMaster, oldRec, attr, ret, nvalue;
    
    // WRITE
    if (newRec !== undefined) {

      // can only take other records or null
      if (newRec && !SC.kindOf(newRec, SC.Record)) {
        throw "%@ is not an instance of SC.Record".fmt(newRec);
      }

      inverseKey = this.get('inverse');
      if (inverseKey) oldRec = this._scsa_call(record, key);

      // careful: don't overwrite value here.  we want the return value to 
      // cache.
      nvalue = this.fromType(record, key, newRec) ; // convert to attribute.
      record.writeAttribute(attrKey, nvalue, !this.get('isMaster')); 
      ret = newRec ;

      // ok, now if we have an inverse relationship, get the inverse 
      // relationship and notify it of what is happening.  This will allow it
      // to update itself as needed.  The callbacks implemented here are 
      // supported by both SingleAttribute and ManyAttribute.
      //
      if (inverseKey && (oldRec !== newRec)) {
        if (oldRec && (attr = oldRec[inverseKey])) {
          attr.inverseDidRemoveRecord(oldRec, inverseKey, record, key);
        }

        if (newRec && (attr = newRec[inverseKey])) {
          attr.inverseDidAddRecord(newRec, inverseKey, record, key);
        }
      }
      
    // READ 
    } else ret = this._scsa_call(record, key, newRec);

    return ret ;
  },
  
  /** @private - save original call() impl */
  _scsa_call: SC.RecordAttribute.prototype.call,
  
  /**
    Called by an inverse relationship whenever the receiver is no longer part
    of the relationship.  If this matches the inverse setting of the attribute
    then it will update itself accordingly.
    
    @param {SC.Record} the record owning this attribute
    @param {String} key the key for this attribute
    @param {SC.Record} inverseRecord record that was removed from inverse
    @param {String} key key on inverse that was modified
    @returns {void}
  */
  inverseDidRemoveRecord: function(record, key, inverseRecord, inverseKey) {

    var myInverseKey  = this.get('inverse'),
        curRec   = this._scsa_call(record, key),
        isMaster = this.get('isMaster'), attr;

    // ok, you removed me, I'll remove you...  if isMaster, notify change.
    record.writeAttribute(key, null, !isMaster);
    record.notifyPropertyChange(key);

    // if we have another value, notify them as well...
    if ((curRec !== inverseRecord) || (inverseKey !== myInverseKey)) {
      if (curRec && (attr = curRec[myInverseKey])) {
        attr.inverseDidRemoveRecord(curRec, myInverseKey, record, key);
      }
    }
  },
  
  /**
    Called by an inverse relationship whenever the receiver is added to the 
    inverse relationship.  This will set the value of this inverse record to 
    the new record.
    
    @param {SC.Record} the record owning this attribute
    @param {String} key the key for this attribute
    @param {SC.Record} inverseRecord record that was added to inverse
    @param {String} key key on inverse that was modified
    @returns {void}
  */
  inverseDidAddRecord: function(record, key, inverseRecord, inverseKey) {
    
    var myInverseKey  = this.get('inverse'),
        curRec   = this._scsa_call(record, key),
        isMaster = this.get('isMaster'), 
        attr, nvalue; 

    // ok, replace myself with the new value...
    nvalue = this.fromType(record, key, inverseRecord); // convert to attr.
    record.writeAttribute(key, nvalue, !isMaster);
    record.notifyPropertyChange(key);

    // if we have another value, notify them as well...
    if ((curRec !== inverseRecord) || (inverseKey !== myInverseKey)) {
      if (curRec && (attr = curRec[myInverseKey])) {
        attr.inverseDidRemoveRecord(curRec, myInverseKey, record, key);
      }
    }
  }

});

/* >>>>>>>>>> BEGIN source/system/many_array.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/**
  @class

  A ManyArray is used to map an array of record ids back to their 
  record objects which will be materialized from the owner store on demand.
  
  Whenever you create a toMany() relationship, the value returned from the 
  property will be an instance of ManyArray.  You can generally customize the
  behavior of ManyArray by passing settings to the toMany() helper.
  
  @extends SC.Enumerable
  @extends SC.Array
  @since SproutCore 1.0
*/

SC.ManyArray = SC.Object.extend(SC.Enumerable, SC.Array,
  /** @scope SC.ManyArray.prototype */ {

  /**
    recordType will tell what type to transform the record to when
    materializing the record.

    @property {String}
  */
  recordType: null,
  
  /**
    If set, the record will be notified whenever the array changes so that 
    it can change its own state
    
    @property {SC.Record}
  */
  record: null,
  
  /**
    If set will be used by the many array to get an editable version of the
    storeIds from the owner.
    
    @property {String}
  */
  propertyName: null,
  
  
  /**
    The ManyAttribute that created this array.
  
    @property {SC.ManyAttribute}
  */
  manyAttribute: null,
  
  /**
    The store that owns this record array.  All record arrays must have a 
    store to function properly.

    @property {SC.Store}
  */
  store: function() {
    return this.get('record').get('store');
  }.property('record').cacheable(),
  
  /**
    The storeKey for the parent record of this many array.  Editing this 
    array will place the parent record into a READY_DIRTY state.

    @property {Number}
  */
  storeKey: function() {
    return this.get('record').get('storeKey');
  }.property('record').cacheable(),


  /**
    Returns the storeIds in read only mode.  Avoids modifying the record 
    unnecessarily.
    
    @property {SC.Array}
  */
  readOnlyStoreIds: function() {
    return this.get('record').readAttribute(this.get('propertyName'));
  }.property(),
  
  
  /**
    Returns an editable array of storeIds.  Marks the owner records as 
    modified. 
    
    @property {SC.Array}
  */
  editableStoreIds: function() {
    var store    = this.get('store'),
        storeKey = this.get('storeKey'),
        pname    = this.get('propertyName'),
        ret, hash;
        
    ret = store.readEditableProperty(storeKey, pname);    
    if (!ret) {
      hash = store.readEditableDataHash(storeKey);
      ret = hash[pname] = [];      
    }
    
    if (ret !== this._prevStoreIds) this.recordPropertyDidChange();
    return ret ;
  }.property(),
  
  
  // ..........................................................
  // COMPUTED FROM OWNER
  // 
  
  /**
    Computed from owner many attribute
    
    @property {Boolean}
  */
  isEditable: function() {
    // NOTE: can't use get() b/c manyAttribute looks like a computed prop
    var attr = this.manyAttribute;
    return attr ? attr.get('isEditable') : NO;
  }.property('manyAttribute').cacheable(),
  
  /**
    Computed from owner many attribute
    
    @property {String}
  */
  inverse: function() {
    // NOTE: can't use get() b/c manyAttribute looks like a computed prop
    var attr = this.manyAttribute;
    return attr ? attr.get('inverse') : null;
  }.property('manyAttribute').cacheable(),
  
  /**
    Computed from owner many attribute
    
    @property {Boolean}
  */
  isMaster: function() {
    // NOTE: can't use get() b/c manyAttribute looks like a computed prop
    var attr = this.manyAttribute;
    return attr ? attr.get('isMaster') : null;
  }.property("manyAttribute").cacheable(),

  /**
    Computed from owner many attribute
    
    @property {Array}
  */
  orderBy: function() {
    // NOTE: can't use get() b/c manyAttribute looks like a computed prop
    var attr = this.manyAttribute;
    return attr ? attr.get('orderBy') : null;
  }.property("manyAttribute").cacheable(),
  
  // ..........................................................
  // ARRAY PRIMITIVES
  // 

  /** @private
    Returned length is a pass-through to the storeIds array.
    
    @property {Number}
  */
  length: function() {
    var storeIds = this.get('readOnlyStoreIds');
    return storeIds ? storeIds.get('length') : 0;
  }.property('readOnlyStoreIds').cacheable(),

  /** @private
    Looks up the store id in the store ids array and materializes a
    records.
  */
  objectAt: function(idx) {
    var recs      = this._records, 
        storeIds  = this.get('readOnlyStoreIds'),
        store     = this.get('store'),
        recordType = this.get('recordType'),
        storeKey, ret, storeId ;
        
    if (!storeIds || !store) return undefined; // nothing to do
    if (recs && (ret=recs[idx])) return ret ; // cached

    // not in cache, materialize
    if (!recs) this._records = recs = [] ; // create cache
    storeId = storeIds.objectAt(idx);
    if (storeId) {

      // if record is not loaded already, then ask the data source to 
      // retrieve it
      storeKey = store.storeKeyFor(recordType, storeId);
      
      if (store.readStatus(storeKey) === SC.Record.EMPTY) {
        store.retrieveRecord(recordType, null, storeKey);
      }
      
      recs[idx] = ret = store.materializeRecord(storeKey);
    }
    return ret ;
  },

  /** @private
    Pass through to the underlying array.  The passed in objects must be
    records, which can be converted to storeIds.
  */
  replace: function(idx, amt, recs) {
    
    if (!this.get('isEditable')) {
      throw "%@.%@[] is not editable".fmt(this.get('record'), this.get('propertyName'));
    }
    
    var storeIds = this.get('editableStoreIds'), 
        len      = recs ? (recs.get ? recs.get('length') : recs.length) : 0,
        record   = this.get('record'),
        pname    = this.get('propertyName'),
        i, keys, ids, toRemove, inverse, attr, inverseRecord;

    // map to store keys
    ids = [] ;
    for(i=0;i<len;i++) ids[i] = recs.objectAt(i).get('id');

    // if we have an inverse - collect the list of records we are about to 
    // remove
    inverse = this.get('inverse');
    if (inverse && amt>0) {
      toRemove = SC.ManyArray._toRemove;
      if (toRemove) SC.ManyArray._toRemove = null; // reuse if possible
      else toRemove = [];
      
      for(i=0;i<amt;i++) toRemove[i] = this.objectAt(i);
    }
    
    // pass along - if allowed, this should trigger the content observer 
    storeIds.replace(idx, amt, ids);

    // ok, notify records that were removed then added; this way reordered
    // objects are added and removed
    if (inverse) {
      
      // notive removals
      for(i=0;i<amt;i++) {
        inverseRecord = toRemove[i];
        attr = inverseRecord ? inverseRecord[inverse] : null;
        if (attr && attr.inverseDidRemoveRecord) {
          attr.inverseDidRemoveRecord(inverseRecord, inverse, record, pname);
        }
      }

      if (toRemove) {
        toRemove.length = 0; // cleanup
        if (!SC.ManyArray._toRemove) SC.ManyArray._toRemove = toRemove;
      }

      // notify additions
      for(i=0;i<len;i++) {
        inverseRecord = recs.objectAt(i);
        attr = inverseRecord ? inverseRecord[inverse] : null;
        if (attr && attr.inverseDidAddRecord) {
          attr.inverseDidAddRecord(inverseRecord, inverse, record, pname);
        }
      }
      
    }

    // only mark record dirty if there is no inverse or we are master
    if (record && (!inverse || this.get('isMaster'))) {
      record.recordDidChange(pname);
    } 
    
    return this;
  },
  
  // ..........................................................
  // INVERSE SUPPORT
  // 
  
  /**
    Called by the ManyAttribute whenever a record is removed on the inverse
    of the relationship.
    
    @param {SC.Record} inverseRecord the record that was removed
    @returns {SC.ManyArray} receiver
  */
  removeInverseRecord: function(inverseRecord) {
    
    if (!inverseRecord) return this; // nothing to do
    var id = inverseRecord.get('id'),
        storeIds = this.get('editableStoreIds'),
        idx      = (storeIds && id) ? storeIds.indexOf(id) : -1,
        record;
    
    if (idx >= 0) {
      storeIds.removeAt(idx);
      if (this.get('isMaster') && (record = this.get('record'))) {
        record.recordDidChange(this.get('propertyName'));
      }
    }
  },

  /**
    Called by the ManyAttribute whenever a record is added on the inverse
    of the relationship.
    
    @param {SC.Record} record the record this array is a part of
    @param {String} key the key this array represents
    @param {SC.Record} inverseRecord the record that was removed
    @param {String} inverseKey the name of inverse that was changed
    @returns {SC.ManyArray} receiver
  */
  addInverseRecord: function(inverseRecord) {
    
    if (!inverseRecord) return this;
    var id = inverseRecord.get('id'),
        storeIds = this.get('editableStoreIds'),
        orderBy  = this.get('orderBy'),
        len      = storeIds.get('length'),
        idx, record;
        
    // find idx to insert at.
    if (orderBy) {
      idx = this._findInsertionLocation(inverseRecord, 0, len, orderBy);
    } else idx = len;
    
    storeIds.insertAt(idx, inverseRecord.get('id'));
    if (this.get('isMaster') && (record = this.get('record'))) {
      record.recordDidChange(this.get('propertyName'));
    }
  },
  
  // binary search to find insertion location
  _findInsertionLocation: function(rec, min, max, orderBy) {
    var idx   = min+Math.floor((max-min)/2),
        cur   = this.objectAt(idx),
        order = this._compare(rec, cur, orderBy);
    if (order < 0) {
      if (idx===0) return idx;
      else return this._findInsertionLocation(rec, 0, idx, orderBy);
    } else if (order > 0) {
      if (idx >= max) return idx;
      else return this._findInsertionLocation(rec, idx, max, orderBy);
    } else return idx;
  },

  _compare: function(a, b, orderBy) {
    var t = SC.typeOf(orderBy),
        ret, idx, len;
        
    if (t === SC.T_FUNCTION) ret = orderBy(a, b);
    else if (t === SC.T_STRING) ret = SC.compare(a,b);
    else {
      len = orderBy.get('length');
      ret = 0;
      for(idx=0;(ret===0) && (idx<len);idx++) ret = SC.compare(a,b);
    }

    return ret ;
  },
  
  // ..........................................................
  // INTERNAL SUPPORT
  //  

  /** @private 
    Invoked whenever the storeIds array changes.  Observes changes.
  */
  recordPropertyDidChange: function(keys) {
    
    if (keys && !keys.contains(this.get('propertyName'))) return this;
    
    var storeIds = this.get('readOnlyStoreIds');
    var prev = this._prevStoreIds, f = this._storeIdsContentDidChange;

    if (storeIds === prev) return this; // nothing to do

    if (prev) prev.removeObserver('[]', this, f);
    this._prevStoreIds = storeIds;
    if (storeIds) storeIds.addObserver('[]', this, f);

    var rev = (storeIds) ? storeIds.propertyRevision : -1 ;
    this._storeIdsContentDidChange(storeIds, '[]', storeIds, rev);
    
  },

  /** @private
    Invoked whenever the content of the storeIds array changes.  This will
    dump any cached record lookup and then notify that the enumerable content
    has changed.
  */
  _storeIdsContentDidChange: function(target, key, value, rev) {
    this._records = null ; // clear cache
    this.enumerableContentDidChange();
  },
  
  /** @private */
  unknownProperty: function(key, value) {
    var ret = this.reducedProperty(key, value);
    return ret === undefined ? arguments.callee.base.apply(this,arguments) : ret;
  },

  /** @private */
  init: function() {
    arguments.callee.base.apply(this,arguments);
    this.recordPropertyDidChange();
  }
  
}) ;
/* >>>>>>>>>> BEGIN source/system/store.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

sc_require('models/record');

/**
  @class


  The Store is where you can find all of your dataHashes. Stores can be 
  chained for editing purposes and committed back one chain level at a time 
  all the way back to a persistent data source.
  
  Every application you create should generally have its own store objects.
  Once you create the store, you will rarely need to work with the store
  directly except to retrieve records and collections.  
  
  Internally, the store will keep track of changes to your json data hashes
  and manage syncing those changes with your data source.  A data source may
  be a server, local storage, or any other persistent code.

  @extends SC.Object
  @since SproutCore 1.0
*/
SC.Store = SC.Object.extend( /** @scope SC.Store.prototype */ {
  
  /**
    An (optional) name of the store, which can be useful during debugging,
    especially if you have multiple nested stores.
    
    @property {String}
  */
  name: null,

  /**
    An array of all the chained stores that current rely on the receiver 
    store.
    
    @property {Array}
  */
  nestedStores: null,

  /**
    The data source is the persistent storage that will provide data to the
    store and save changes.  You normally will set your data source when you
    first create your store in your application.
    
    @property {SC.DataSource}
  */
  dataSource: null,
  
  /**
    This type of store is not nested.
    
    @property {Boolean}
  */
  isNested: NO,
  
  /**
    This type of store is not nested.
    
    @property {Boolean}
  */
  commitRecordsAutomatically: NO,
  
  // ..........................................................
  // DATA SOURCE SUPPORT
  // 
  
  /**
    Convenience method.  Sets the current data source to the passed property.
    This will also set the store property on the dataSource to the receiver.
    
    If you are using this from the core.js method of your app, you may need to
    just pass a string naming your data source class.  If this is the case,
    then your data source will be instantiated the first time it is requested.
    
    @param {SC.DataSource|String} dataSource the data source
    @returns {SC.Store} receiver
  */
  from: function(dataSource) {
    this.set('dataSource', dataSource);
    return this ;
  },
  
  // lazily convert data source to real object
  _getDataSource: function() {
    var ret = this.get('dataSource');
    if (typeof ret === SC.T_STRING) {
      ret = SC.objectForPropertyPath(ret);
      if (ret) ret = ret.create();
      if (ret) this.set('dataSource', ret);
    }
    return ret;
  },
  
  /**
    Convenience method.  Creates a CascadeDataSource with the passed 
    data source arguments and sets the CascadeDataSource as the data source 
    for the receiver.
    
    @param {SC.DataSource...} dataSource one or more data source arguments
    @returns {SC.Store} reciever
  */
  cascade: function(dataSource) {
    var dataSources = SC.A(arguments) ;
    dataSource = SC.CascadeDataSource.create({
      dataSources: dataSources 
    });
    return this.from(dataSource);
  },
  
  // ..........................................................
  // STORE CHAINING
  // 
  
  /**  
    Returns a new nested store instance that can be used to buffer changes
    until you are ready to commit them.  When you are ready to commit your 
    changes, call commitChanges() or destroyChanges() and then destroy() when
    you are finished with the chained store altogether.
    
    {{{
      store = MyApp.store.chain();
      .. edit edit edit
      store.commitChanges().destroy();
    }}}
    
    @param {Hash} attrs optional attributes to set on new store
    @param {Class} newStoreClass optional the class of the newly-created nested store (defaults to SC.NestedStore)
    @returns {SC.NestedStore} new nested store chained to receiver
  */
  chain: function(attrs, newStoreClass) {
    if (!attrs) attrs = {};
    attrs.parentStore = this;
    
    if (newStoreClass) {
      // Ensure the passed-in class is a type of nested store.
      if (SC.typeOf(newStoreClass) !== 'class') throw new Error("%@ is not a valid class".fmt(newStoreClass));
      if (!SC.kindOf(newStoreClass, SC.NestedStore)) throw new Error("%@ is not a type of SC.NestedStore".fmt(newStoreClass));
    }
    else {
      newStoreClass = SC.NestedStore;
    }
    
    var ret    = newStoreClass.create(attrs),
        nested = this.nestedStores;
        
    if (!nested) nested = this.nestedStores = [];
    nested.push(ret);
    return ret ;
  },
  
  /** @private
  
    Called by a nested store just before it is destroyed so that the parent
    can remove the store from its list of nested stores.
    
    @returns {SC.Store} receiver
  */
  willDestroyNestedStore: function(nestedStore) {
    if (this.nestedStores) {
      this.nestedStores.removeObject(nestedStore);
    }
    return this ;
  },

  /**
    Used to determine if a nested store belongs directly or indirectly to the
    receiver.
    
    @param {SC.Store} store store instance
    @returns {Boolean} YES if belongs
  */
  hasNestedStore: function(store) {
    while(store && (store !== this)) store = store.get('parentStore');
    return store === this ;
  },

  // ..........................................................
  // SHARED DATA STRUCTURES 
  // 
  
  /** @private
    JSON data hashes indexed by store key.  
    
    *IMPORTANT: Property is not observable*

    Shared by a store and its child stores until you make edits to it.
    
    @property {Hash}
  */
  dataHashes: null,

  /** @private
    The current status of a data hash indexed by store key.
    
    *IMPORTANT: Property is not observable*

    Shared by a store and its child stores until you make edits to it.
    
    @property {Hash}
  */
  statuses: null,
    
  /** @private
    This array contains the revisions for the attributes indexed by the 
    storeKey.  
    
    *IMPORTANT: Property is not observable*
    
    Revisions are used to keep track of when an attribute hash has been 
    changed. A store shares the revisions data with its parent until it 
    starts to make changes to it.
    
    @property {Hash}
  */
  revisions: null,

  /**
    Array indicates whether a data hash is possibly in use by an external 
    record for editing.  If a data hash is editable then it may be modified
    at any time and therefore chained stores may need to clone the 
    attributes before keeping a copy of them.
  
    Note that this is kept as an array because it will be stored as a dense 
    array on some browsers, making it faster.
    
    @property {Array}
  */
  editables: null,
    
  /**
    A set of storeKeys that need to be committed back to the data source. If
    you call commitRecords() without passing any other parameters, the keys
    in this set will be committed instead.
  
    @property {Array}
  */
  changelog: null,
  
  /**
    A set of SC.RecordArray that have been returned from findAll with an 
    SC.Query. These will all be notified with _notifyRecordArraysWithQuery() 
    whenever the store changes.
  
    @property {Array}
  */
  recordArraysWithQuery: null,
  
  /**
    An array of SC.Error objects associated with individual records in the
    store (indexed by store keys).
    
    Errors passed form the data source in the call to dataSourceDidError() are
    stored here.
    
    @property {Array}
  */
  recordErrors: null,
  
  /**
    A hash of SC.Error objects associated with queries (indexed by the GUID
    of the query).
    
    Errors passed from the data source in the call to dataSourceDidErrorQuery()
    are stored here.
    
    @property {Hash}
  */
  queryErrors: null,
  
  // ..........................................................
  // CORE ATTRIBUTE API
  // 
  // The methods in this layer work on data hashes in the store.  They do not
  // perform any changes that can impact records.  Usually you will not need 
  // to use these methods.
  
  /**
    Returns the current edit status of a storekey.  May be one of EDITABLE or
    LOCKED.  Used mostly for unit testing.
    
    @param {Number} storeKey the store key
    @returns {Number} edit status
  */
  storeKeyEditState: function(storeKey) {
    var editables = this.editables, locks = this.locks;
    return (editables && editables[storeKey]) ? SC.Store.EDITABLE : SC.Store.LOCKED ;
  },
   
  /** 
    Returns the data hash for the given storeKey.  This will also 'lock'
    the hash so that further edits to the parent store will no 
    longer be reflected in this store until you reset.
    
    @param {Number} storeKey key to retrieve
    @returns {Hash} data hash or null
  */
  readDataHash: function(storeKey) {
    return this.dataHashes[storeKey];
  },
  
  /** 
    Returns the data hash for the storeKey, cloned so that you can edit
    the contents of the attributes if you like.  This will do the extra work
    to make sure that you only clone the attributes one time.  
    
    If you use this method to modify data hash, be sure to call 
    dataHashDidChange() when you make edits to record the change.
    
    @param {Number} storeKey the store key to retrieve
    @returns {Hash} the attributes hash
  */
  readEditableDataHash: function(storeKey) {
    // read the value - if there is no hash just return; nothing to do
    var ret = this.dataHashes[storeKey];
    if (!ret) return ret ; // nothing to do.

    // clone data hash if not editable
    var editables = this.editables;
    if (!editables) editables = this.editables = [];
    if (!editables[storeKey]) {
      editables[storeKey] = 1 ; // use number to store as dense array
      ret = this.dataHashes[storeKey] = SC.clone(ret);
    }
    return ret;
  },
  
  /**
    Reads a property from the hash - cloning it if needed so you can modify 
    it independently of any parent store.  This method is really only well
    tested for use with toMany relationships.  Although it is public you 
    generally should not call it directly.
    
    @param {Number} storeKey storeKey of data hash 
    @param {String} propertyName property to read
    @returns {Object} editable property value
  */
  readEditableProperty: function(storeKey, propertyName) {
    var hash      = this.readEditableDataHash(storeKey), 
        editables = this.editables[storeKey], // get editable info...
        ret       = hash[propertyName];
        
    // editables must be made into a hash so that we can keep track of which
    // properties have already been made editable
    if (editables === 1) editables = this.editables[storeKey] = {};
    
    // clone if needed
    if (!editables[propertyName]) {
      ret = hash[propertyName];
      if (ret && ret.isCopyable) ret = hash[propertyName] = ret.copy();
      editables[propertyName] = YES ;
    }
    
    return ret ;
  },
  
  /**
    Replaces the data hash for the storeKey.  This will lock the data hash and
    mark them as cloned.  This will also call dataHashDidChange() for you.
    
    Note that the hash you set here must be a different object from the 
    original data hash.  Once you make a change here, you must also call
    dataHashDidChange() to register the changes.

    If the data hash does not yet exist in the store, this method will add it.
    Pass the optional status to edit the status as well.
    
    @param {Number} storeKey the store key to write
    @param {Hash} hash the new hash
    @param {String} status the new hash status
    @returns {SC.Store} receiver
  */
  writeDataHash: function(storeKey, hash, status) {

    // update dataHashes and optionally status.
    if (hash) this.dataHashes[storeKey] = hash;
    if (status) this.statuses[storeKey] = status ;
    
    // also note that this hash is now editable
    var editables = this.editables;
    if (!editables) editables = this.editables = [];
    editables[storeKey] = 1 ; // use number for dense array support
    
    return this ;
  },

  /**
    Removes the data hash from the store.  This does not imply a deletion of
    the record.  You could be simply unloading the record.  Eitherway, 
    removing the dataHash will be synced back to the parent store but not to 
    the server.
    
    Note that you can optionally pass a new status to go along with this. If
    you do not pass a status, it will change the status to SC.RECORD_EMPTY
    (assuming you just unloaded the record).  If you are deleting the record
    you may set it to SC.Record.DESTROYED_CLEAN.
    
    Be sure to also call dataHashDidChange() to register this change.
    
    @param {Number} storeKey
    @param {String} status optional new status
    @returns {SC.Store} reciever
  */
  removeDataHash: function(storeKey, status) {
    var rev ;
    
     // don't use delete -- that will allow parent dataHash to come through
    this.dataHashes[storeKey] = null;  
    this.statuses[storeKey] = status || SC.Record.EMPTY;
    rev = this.revisions[storeKey] = this.revisions[storeKey]; // copy ref
    
    // hash is gone and therefore no longer editable
    var editables = this.editables;
    if (editables) editables[storeKey] = 0 ;
    
    return this ;    
  },
  
  /**
    Reads the current status for a storeKey.  This will also lock the data 
    hash.  If no status is found, returns SC.RECORD_EMPTY.
    
    @param {Number} storeKey the store key
    @returns {Number} status
  */
  readStatus: function(storeKey) {
    // use readDataHash to handle optimistic locking.  this could be inlined
    // but for now this minimized copy-and-paste code.
    this.readDataHash(storeKey);
    return this.statuses[storeKey] || SC.Record.EMPTY;
  },
  
  /**
    Reads the current status for the storeKey without actually locking the 
    record.  Usually you won't need to use this method.  It is mostly used
    internally.
    
    @param {Number} storeKey the store key
    @returns {Number} status
  */
  peekStatus: function(storeKey) {
    return this.statuses[storeKey] || SC.Record.EMPTY;  
  },
  
  /**
    Writes the current status for a storeKey.  If the new status is 
    SC.Record.ERROR, you may also pass an optional error object.  Otherwise 
    this param is ignored.
    
    @param {Number} storeKey the store key
    @param {String} newStatus the new status
    @param {SC.Error} error optional error object
    @returns {SC.Store} receiver
  */
  writeStatus: function(storeKey, newStatus) {
    // use writeDataHash for now to handle optimistic lock.  maximize code 
    // reuse.
    return this.writeDataHash(storeKey, null, newStatus);
  },
  
  /**
    Call this method whenever you modify some editable data hash to register
    with the Store that the attribute values have actually changed.  This will
    do the book-keeping necessary to track the change across stores including 
    managing locks.
    
    @param {Number|Array} storeKeys one or more store keys that changed
    @param {Number} rev optional new revision number. normally leave null
    @param {Boolean} statusOnly (optional) YES if only status changed
    @param {String} key that changed (optional)
    @returns {SC.Store} receiver
  */
  dataHashDidChange: function(storeKeys, rev, statusOnly, key) {
    
    // update the revision for storeKey.  Use generateStoreKey() because that
    // gaurantees a universally (to this store hierarchy anyway) unique 
    // key value.
    if (!rev) rev = SC.Store.generateStoreKey();
    var isArray, len, idx, storeKey;
    
    isArray = SC.typeOf(storeKeys) === SC.T_ARRAY;
    if (isArray) {
      len = storeKeys.length;
    } else {
      len = 1;
      storeKey = storeKeys;
    }
    
    for(idx=0;idx<len;idx++) {
      if (isArray) storeKey = storeKeys[idx];
      this.revisions[storeKey] = rev;
      this._notifyRecordPropertyChange(storeKey, statusOnly, key);
    }
    
    return this ;
  },

  /** @private 
    Will push all changes to a the recordPropertyChanges property
    and execute flush() once at the end of the runloop.
  */
  _notifyRecordPropertyChange: function(storeKey, statusOnly, key) {
    
    var records      = this.records, 
        nestedStores = this.get('nestedStores'),
        K            = SC.Store,
        rec, editState, len, idx, store, status, keys;
    
    // pass along to nested stores
    len = nestedStores ? nestedStores.length : 0 ;
    for(idx=0;idx<len;idx++) {
      store = nestedStores[idx];
      status = store.peekStatus(storeKey); // important: peek avoids read-lock
      editState = store.storeKeyEditState(storeKey);
      
      // when store needs to propagate out changes in the parent store
      // to nested stores
      if (editState === K.INHERITED) {
        store._notifyRecordPropertyChange(storeKey, statusOnly, key);

      } else if (status & SC.Record.BUSY) {
        // make sure nested store does not have any changes before resetting
        if(store.get('hasChanges')) throw K.CHAIN_CONFLICT_ERROR;
        store.reset();
      }
    }
    
    // store info in changes hash and schedule notification if needed.
    var changes = this.recordPropertyChanges;
    if (!changes) {
      changes = this.recordPropertyChanges = 
        { storeKeys:      SC.CoreSet.create(),
          records:        SC.CoreSet.create(),
          hasDataChanges: SC.CoreSet.create(),
          propertyForStoreKeys: {} };
    }
    
    changes.storeKeys.add(storeKey);

    if (records && (rec=records[storeKey])) {
      changes.records.push(storeKey);
      
      // If there are changes other than just the status we need to record
      // that information so we do the right thing during the next flush.
      // Note that if we're called multiple times before flush and one call
      // has statusOnly=true and another has statusOnly=false, the flush will
      // (correctly) operate in statusOnly=false mode.
      if (!statusOnly) changes.hasDataChanges.push(storeKey);
      
      // If this is a key specific change, make sure that only those
      // properties/keys are notified.  However, if a previous invocation of
      // _notifyRecordPropertyChange specified that all keys have changed, we
      // need to respect that.
      if (key) {
        if (!(keys = changes.propertyForStoreKeys[storeKey])) {
          keys = changes.propertyForStoreKeys[storeKey] = SC.CoreSet.create();
        }
        
        // If it's '*' instead of a set, then that means there was a previous
        // invocation that said all keys have changed.
        if (keys !== '*') {
          keys.add(key);
        }
      }
      else {
        // Mark that all properties have changed.
        changes.propertyForStoreKeys[storeKey] = '*';
      }
    }
    
    this.invokeOnce(this.flush);
    return this;
  },

  /**
    Delivers any pending changes to materialized records.  Normally this 
    happens once, automatically, at the end of the RunLoop.  If you have
    updated some records and need to update records immediately, however, 
    you may call this manually.

    @returns {SC.Store} receiver
  */
  flush: function() {
    if (!this.recordPropertyChanges) return this;
    
    var changes              = this.recordPropertyChanges,
        storeKeys            = changes.storeKeys,
        hasDataChanges       = changes.hasDataChanges,
        records              = changes.records,
        propertyForStoreKeys = changes.propertyForStoreKeys,
        recordTypes = SC.CoreSet.create(),
        rec, recordType, statusOnly, idx, len, storeKey, keys;
    
    storeKeys.forEach(function(storeKey) {
      if (records.contains(storeKey)) {
        statusOnly = hasDataChanges.contains(storeKey) ? NO : YES;
        rec = this.records[storeKey];
        keys = propertyForStoreKeys ? propertyForStoreKeys[storeKey] : null;
        
        // Are we invalidating all keys?  If so, don't pass any to
        // storeDidChangeProperties.
        if (keys === '*') keys = null;
        
        // remove it so we don't trigger this twice
        records.remove(storeKey);
        
        if (rec) rec.storeDidChangeProperties(statusOnly, keys);
      }
      
      recordType = SC.Store.recordTypeFor(storeKey);
      recordTypes.add(recordType);
      
    }, this);

    this._notifyRecordArrays(storeKeys, recordTypes);

    storeKeys.clear();
    hasDataChanges.clear();
    records.clear();
    // Provide full reference to overwrite
    this.recordPropertyChanges.propertyForStoreKeys = {};
    
    return this;
  },
  
  /**
    Resets the store content.  This will clear all internal data for all
    records, resetting them to an EMPTY state.  You generally do not want
    to call this method yourself, though you may override it.
    
    @returns {SC.Store} receiver
  */
  reset: function() {
    
    // create a new empty data store
    this.dataHashes = {} ;
    this.revisions  = {} ;
    this.statuses   = {} ;

    // also reset temporary objects and errors
    this.chainedChanges = this.locks = this.editables = null;
    this.changelog = null ;
    this.recordErrors = null;
    this.queryErrors = null;

    var records = this.records, storeKey;
    if (records) {
      for(storeKey in records) {
        if (!records.hasOwnProperty(storeKey)) continue ;
        this._notifyRecordPropertyChange(storeKey, NO);
      }
    }
    
    this.set('hasChanges', NO);
  },
  
  /** @private
    Called by a nested store on a parent store to commit any changes from the
    store.  This will copy any changed dataHashes as well as any persistant 
    change logs.
    
    If the parentStore detects a conflict with the optimistic locking, it will
    raise an exception before it makes any changes.  If you pass the 
    force flag then this detection phase will be skipped and the changes will
    be applied even if another resource has modified the store in the mean
    time.
  
    @param {SC.Store} nestedStore the child store
    @param {Array} changes the array of changed store keys
    @param {Boolean} force
    @returns {SC.Store} receiver
  */
  commitChangesFromNestedStore: function(nestedStore, changes, force) {
    // first, check for optimistic locking problems
    if (!force) this._verifyLockRevisions(changes, nestedStore.locks);
    
    // OK, no locking issues.  So let's just copy them changes. 
    // get local reference to values.
    var len = changes.length, i, storeKey, myDataHashes, myStatuses, 
      myEditables, myRevisions, chDataHashes, chStatuses, chRevisions;
    
    myRevisions  = this.revisions ;
    myDataHashes = this.dataHashes;
    myStatuses   = this.statuses;
    myEditables  = this.editables ;
    
    // setup some arrays if needed
    if (!myEditables) myEditables = this.editables = [] ;
    
    chDataHashes = nestedStore.dataHashes;
    chRevisions  = nestedStore.revisions ;
    chStatuses   = nestedStore.statuses;
    
    for(i=0;i<len;i++) {
      storeKey = changes[i];

      // now copy changes
      myDataHashes[storeKey] = chDataHashes[storeKey];
      myStatuses[storeKey]   = chStatuses[storeKey];
      myRevisions[storeKey]  = chRevisions[storeKey];
      
      myEditables[storeKey] = 0 ; // always make dataHash no longer editable
      
      this._notifyRecordPropertyChange(storeKey, NO);
    }
    
    // add any records to the changelog for commit handling
    var myChangelog = this.changelog, chChangelog = nestedStore.changelog;
    if (chChangelog) {
      if (!myChangelog) myChangelog = this.changelog = SC.CoreSet.create();
      myChangelog.addEach(chChangelog);
    }  
    this.changelog = myChangelog;
    
    // immediately flush changes to notify records - nested stores will flush
    // later on.
    if (!this.get('parentStore')) this.flush();
    
    return this ;
  },

  /** @private
    Verifies that the passed lock revisions match the current revisions 
    in the receiver store.  If the lock revisions do not match, then the 
    store is in a conflict and an exception will be raised.
    
    @param {Array}  changes set of changes we are trying to apply
    @param {SC.Set} locks the locks to verify
    @returns {SC.Store} receiver
  */
  _verifyLockRevisions: function(changes, locks) {
    var len = changes.length, revs = this.revisions, i, storeKey, lock, rev ;
    if (locks && revs) {
      for(i=0;i<len;i++) {
        storeKey = changes[i];
        lock = locks[storeKey] || 1;
        rev  = revs[storeKey] || 1;

        // if the save revision for the item does not match the current rev
        // the someone has changed the data hash in this store and we have
        // a conflict. 
        if (lock < rev) throw SC.Store.CHAIN_CONFLICT_ERROR;
      }   
    }
    return this ;
  },
  
  // ..........................................................
  // HIGH-LEVEL RECORD API
  // 
  
  /**
    Finds a single record instance with the specified recordType and id or an 
    array of records matching some query conditions.
    
    h2. Finding a Single Record
    
    If you pass a single recordType and id, this method will return an actual
    record instance.  If the record has not been loaded into the store yet,
    this method will ask the data source to retrieve it.  If no data source
    indicates that it can retrieve the record, then this method will return
    null.
    
    Note that if the record needs to be retrieved from the server, then the
    record instance returned from this method will not have any data yet. 
    Instead it will have a status of SC.Record.READY_LOADING.  You can monitor
    the status property to be notified when the record data is available for 
    you to use it.
    
    h2. Find a Collection of Records
    
    If you pass only a record type or a query object, you can instead find 
    all records matching a specified set of conditions.  When you call find()
    in this way, it will create a query if needed and pass it to the data
    source to fetch the results.
    
    If this is the first time you have fetched the query, then the store will
    automatically ask the data source to fetch any records related to it as 
    well.  Otherwise you can refresh the query results at anytime by calling
    refresh() on the returned RecordArray.

    You can detect whether a RecordArray is fetching from the server by 
    checking its status.
    
    h2. Examples
    
    Finding a single record:
    
    {{{
      MyApp.store.find(MyApp.Contact, "23"); // returns MyApp.Contact
    }}}
    
    Finding all records of a particular type:
    
    {{{
      MyApp.store.find(MyApp.Contact); // returns SC.RecordArray of contacts
    }}}
    
    Finding all contacts with first name John:
    
    {{{
      var query = SC.Query.local(MyApp.Contact, "firstName = %@", "John");
      MyApp.store.find(query); // returns SC.RecordArray of contacts
    }}}
    
    Finding all contacts using a remote query:
    
    {{{
      var query = SC.Query.remote(MyApp.Contact);
      MyApp.store.find(query); // returns SC.RecordArray filled by server
    }}}
    
    @param {SC.Record|String} recordType the expected record type
    @param {String} id the id to load
    @returns {SC.Record} record instance or null
  */
  find: function(recordType, id) {
    
    // if recordType is passed as string, find object
    if (SC.typeOf(recordType)===SC.T_STRING) {
      recordType = SC.objectForPropertyPath(recordType);
    }
    
    // handle passing a query...
    if ((arguments.length === 1) && !(recordType && recordType.get && recordType.get('isRecord'))) {
      if (!recordType) throw new Error("SC.Store#find() must pass recordType or query");
      if (!recordType.isQuery) {
        recordType = SC.Query.local(recordType);
      }
      return this._findQuery(recordType, YES, YES);
      
    // handle finding a single record
    } else {
      return this._findRecord(recordType, id);
    }
  },

  /** @private
    DEPRECATED used find() instead.
    
    This method will accept a record type or query and return a record array
    matching the results.  This method was commonly used prior to SproutCore 
    1.0.  It has been deprecated in favor of a single find() method instead.
    
    For compatibility, this method will continue to work in SproutCore 1.0 but
    it will raise a warning.  It will be removed in a future version of 
    SproutCore.
  */
  findAll: function(recordType, conditions, params) {
    console.warn("SC.Store#findAll() will be removed in a future version of SproutCore.  Use SC.Store#find() instead");
    

    if (!recordType || !recordType.isQuery) {
      recordType = SC.Query.local(recordType, conditions, params);
    }
    
    return this._findQuery(recordType, YES, YES);
  },
  
  
  _findQuery: function(query, createIfNeeded, refreshIfNew) {

    // lookup the local RecordArray for this query.
    var cache = this._scst_recordArraysByQuery, 
        key   = SC.guidFor(query),
        ret, ra ;
    if (!cache) cache = this._scst_recordArraysByQuery = {};
    ret = cache[key];
    
    // if a RecordArray was not found, then create one and also add it to the
    // list of record arrays to update.
    if (!ret && createIfNeeded) {
      cache[key] = ret = SC.RecordArray.create({ store: this, query: query });

      ra = this.get('recordArrays');
      if (!ra) this.set('recordArrays', ra = SC.Set.create());
      ra.add(ret);

      if (refreshIfNew) this.refreshQuery(query);
    }
    
    this.flush();
    return ret ;
  },
  
  _findRecord: function(recordType, id) {

    var storeKey ; 
    
    // if a record instance is passed, simply use the storeKey.  This allows 
    // you to pass a record from a chained store to get the same record in the
    // current store.
    if (recordType && recordType.get && recordType.get('isRecord')) {
      storeKey = recordType.get('storeKey');
      
    // otherwise, lookup the storeKey for the passed id.  look in subclasses 
    // as well.
    } else storeKey = id ? recordType.storeKeyFor(id) : null;
    
    if (storeKey && (this.readStatus(storeKey) === SC.Record.EMPTY)) {
      storeKey = this.retrieveRecord(recordType, id);
    }
    
    // now we have the storeKey, materialize the record and return it.
    return storeKey ? this.materializeRecord(storeKey) : null ;
  },

  // ..........................................................
  // RECORD ARRAY OPERATIONS
  // 

  /**
    Called by the record array just before it is destroyed.  This will 
    de-register it from receiving future notifications.

    You should never call this method yourself.  Instead call destroy() on the
    RecordArray directly.
    
    @param {SC.RecordArray} recordArray the record array
    @returns {SC.Store} receiver
  */
  recordArrayWillDestroy: function(recordArray) {
    var cache = this._scst_recordArraysByQuery,
        set   = this.get('recordArrays');
        
    if (cache) delete cache[SC.guidFor(recordArray.get('query'))];
    if (set) set.remove(recordArray);
    return this ;
  },

  /**
    Called by the record array whenever it needs the data source to refresh
    its contents.  Nested stores will actually just pass this along to the
    parent store.  The parent store will call fetch() on the data source.

    You should never call this method yourself.  Instead call refresh() on the
    RecordArray directly.
    
    @param {SC.Query} query the record array query to refresh
    @returns {SC.Store} receiver
  */
  refreshQuery: function(query) {
    if (!query) throw new Error("refreshQuery() requires a query");

    var cache    = this._scst_recordArraysByQuery,
        recArray = cache ? cache[SC.guidFor(query)] : null, 
        source   = this._getDataSource();
        
    if (source && source.fetch) {
      if (recArray) recArray.storeWillFetchQuery(query);
      source.fetch.call(source, this, query);
    }
    
    return this ;      
  },
  
  /** @private 
    Will ask all record arrays that have been returned from findAll
    with an SC.Query to check their arrays with the new storeKeys
    
    @param {SC.IndexSet} storeKeys set of storeKeys that changed
    @param {SC.Set} recordTypes
    @returns {SC.Store} receiver
  */
  _notifyRecordArrays: function(storeKeys, recordTypes) {
    var recordArrays = this.get('recordArrays');
    if (!recordArrays) return this;

    recordArrays.forEach(function(recArray) {
      if (recArray) recArray.storeDidChangeStoreKeys(storeKeys, recordTypes);
    }, this);
    
    return this ;
  },
  
  
  // ..........................................................
  // LOW-LEVEL HELPERS
  // 
  
  /**
    Array of all records currently in the store with the specified
    type.  This method only reflects the actual records loaded into memory and
    therefore is not usually needed at runtime.  However you will often use
    this method for testing.
    
    @param {SC.Record} recordType the record type
    @returns {SC.Array} array instance - usually SC.RecordArray
  */
  recordsFor: function(recordType) {
    var storeKeys     = [], 
        storeKeysById = recordType.storeKeysById(),
        id, storeKey, ret;
    
    // collect all non-empty store keys
    for(id in storeKeysById) {
      storeKey = storeKeysById[id]; // get the storeKey
      if (this.readStatus(storeKey) !== SC.RECORD_EMPTY) {
        storeKeys.push(storeKey);
      }
    }
    
    if (storeKeys.length>0) {
      ret = SC.RecordArray.create({ store: this, storeKeys: storeKeys });
    } else ret = storeKeys; // empty array
    return ret ;
  },
  
  _TMP_REC_ATTRS: {},
  
  /** 
    Given a storeKey, return a materialized record.  You will not usually
    call this method yourself.  Instead it will used by other methods when
    you find records by id or perform other searches.

    If a recordType has been mapped to the storeKey, then a record instance
    will be returned even if the data hash has not been requested yet.
    
    Each Store instance returns unique record instances for each storeKey.

    @param {Number} storeKey The storeKey for the dataHash.
    @returns {SC.Record} Returns a record instance.
  */
  materializeRecord: function(storeKey) {
    var records = this.records, ret, recordType, attrs;
    
    // look up in cached records
    if (!records) records = this.records = {}; // load cached records
    ret = records[storeKey];
    if (ret) return ret;
    
    // not found -- OK, create one then.
    recordType = SC.Store.recordTypeFor(storeKey);
    if (!recordType) return null; // not recordType registered, nothing to do
    
    attrs = this._TMP_REC_ATTRS ;
    attrs.storeKey = storeKey ;
    attrs.store    = this ;
    ret = records[storeKey] = recordType.create(attrs);
    
    return ret ;
  },

  // ..........................................................
  // CORE RECORDS API
  // 
  // The methods in this section can be used to manipulate records without 
  // actually creating record instances.
  
  /**
    Creates a new record instance with the passed recordType and dataHash.
    You can also optionally specify an id or else it will be pulled from the 
    data hash.

    Note that the record will not yet be saved back to the server.  To save
    a record to the server, call commitChanges() on the store.

    @param {SC.Record} recordType the record class to use on creation
    @param {Hash} dataHash the JSON attributes to assign to the hash.
    @param {String} id (optional) id to assign to record

    @returns {SC.Record} Returns the created record
  */
  createRecord: function(recordType, dataHash, id) {
    var primaryKey, storeKey, status, K = SC.Record, changelog, defaultVal;
    
    // First, try to get an id.  If no id is passed, look it up in the 
    // dataHash.
    if (!id && (primaryKey = recordType.prototype.primaryKey)) {
      id = dataHash[primaryKey];
      // if still no id, check if there is a defaultValue function for
      // the primaryKey attribute and assign that
      defaultVal = recordType.prototype[primaryKey] ? recordType.prototype[primaryKey].defaultValue : null;
      if(!id && SC.typeOf(defaultVal)===SC.T_FUNCTION) {
        id = dataHash[primaryKey] = defaultVal();
      }
    }
    
    // Next get the storeKey - base on id if available
    storeKey = id ? recordType.storeKeyFor(id) : SC.Store.generateStoreKey();
    
    // now, check the state and do the right thing.
    status = this.readStatus(storeKey);
    
    // check state
    // any busy or ready state or destroyed dirty state is not allowed
    if ((status & K.BUSY)  || 
        (status & K.READY) || 
        (status == K.DESTROYED_DIRTY)) { 
      throw id ? K.RECORD_EXISTS_ERROR : K.BAD_STATE_ERROR;
      
    // allow error or destroyed state only with id
    } else if (!id && (status==SC.DESTROYED_CLEAN || status==SC.ERROR)) {
      throw K.BAD_STATE_ERROR;
    }
    
    // add dataHash and setup initial status -- also save recordType
    this.writeDataHash(storeKey, (dataHash ? dataHash : {}), K.READY_NEW);
    
    SC.Store.replaceRecordTypeFor(storeKey, recordType);
    this.dataHashDidChange(storeKey);
    
    // Record is now in a committable state -- add storeKey to changelog
    changelog = this.changelog;
    if (!changelog) changelog = SC.Set.create();
    changelog.add(storeKey);
    this.changelog = changelog;
    
    // if commit records is enabled
    if(this.get('commitRecordsAutomatically')){
      this.invokeLast(this.commitRecords);
    }
    
    // finally return materialized record
    return this.materializeRecord(storeKey) ;
  },
  
  /**
    Creates an array of new records.  You must pass an array of dataHashes 
    plus a recordType and, optionally, an array of ids.  This will create an
    array of record instances with the same record type.
    
    If you need to instead create a bunch of records with different data types
    you can instead pass an array of recordTypes, one for each data hash.
    
    @param {SC.Record|Array} recordTypes class or array of classes
    @param {Array} dataHashes array of data hashes
    @param {Array} ids (optional) ids to assign to records
    @returns {Array} array of materialized record instances.
  */
  createRecords: function(recordTypes, dataHashes, ids) {
    var ret = [], recordType, id, isArray, len = dataHashes.length, idx ;
    isArray = SC.typeOf(recordTypes) === SC.T_ARRAY;
    if (!isArray) recordType = recordTypes;
    for(idx=0;idx<len;idx++) {
      if (isArray) recordType = recordTypes[idx] || SC.Record;
      id = ids ? ids[idx] : undefined ;
      ret.push(this.createRecord(recordType, dataHashes[idx], id));
    }
    return ret ;
  },
  
  /**
    Destroys a record, removing the data hash from the store and adding the
    record to the destroyed changelog.  If you try to destroy a record that is 
    already destroyed then this method will have no effect.  If you destroy a 
    record that does not exist or an error then an exception will be raised.
    
    @param {SC.Record} recordType the recordType
    @param {String} id the record id
    @param {Number} storeKey (optional) if passed, ignores recordType and id
    @returns {SC.Store} receiver
  */
  destroyRecord: function(recordType, id, storeKey) {
    if (storeKey === undefined) storeKey = recordType.storeKeyFor(id);
    var status = this.readStatus(storeKey), changelog, K = SC.Record;

    // handle status - ignore if destroying or destroyed
    if ((status === K.BUSY_DESTROYING) || (status & K.DESTROYED)) {
      return this; // nothing to do
      
    // error out if empty
    } else if (status == K.EMPTY) {
      throw K.NOT_FOUND_ERROR ;
      
    // error out if busy
    } else if (status & K.BUSY) {
      throw K.BUSY_ERROR ;
      
    // if new status, destroy but leave in clean state
    } else if (status == K.READY_NEW) {
      status = K.DESTROYED_CLEAN ;
      
    // otherwise, destroy in dirty state
    } else status = K.DESTROYED_DIRTY ;
    
    // remove the data hash, set new status
    this.writeStatus(storeKey, status);
    this.dataHashDidChange(storeKey);

    // add/remove change log
    changelog = this.changelog;
    if (!changelog) changelog = this.changelog = SC.Set.create();

    ((status & K.DIRTY) ? changelog.add(storeKey) : changelog.remove(storeKey));
    this.changelog=changelog;

    // if commit records is enabled
    if(this.get('commitRecordsAutomatically')){
      this.invokeLast(this.commitRecords);
    }
        
    return this ;
  },
  
  /**
    Destroys a group of records.  If you have a set of record ids, destroying
    them this way can be faster than retrieving each record and destroying 
    it individually.
    
    You can pass either a single recordType or an array of recordTypes.  If
    you pass a single recordType, then the record type will be used for each
    record.  If you pass an array, then each id must have a matching record 
    type in the array.

    You can optionally pass an array of storeKeys instead of the recordType
    and ids.  In this case the first two parameters will be ignored.  This
    is usually only used by low-level internal methods.  You will not usually
    destroy records this way.
    
    @param {SC.Record|Array} recordTypes class or array of classes
    @param {Array} ids ids to destroy
    @param {Array} storeKeys (optional) store keys to destroy
    @returns {SC.Store} receiver
  */
  destroyRecords: function(recordTypes, ids, storeKeys) {
    var len, isArray, idx, id, recordType, storeKey;
    if(storeKeys===undefined){
      len = ids.length;
      isArray = SC.typeOf(recordTypes) === SC.T_ARRAY;
      if (!isArray) recordType = recordTypes;
      for(idx=0;idx<len;idx++) {
        if (isArray) recordType = recordTypes[idx] || SC.Record;
        id = ids ? ids[idx] : undefined ;
        this.destroyRecord(recordType, id, undefined);
      }
    }else{
      len = storeKeys.length;
      for(idx=0;idx<len;idx++) {
        storeKey = storeKeys ? storeKeys[idx] : undefined ;
        this.destroyRecord(undefined, undefined, storeKey);
      }
    }
    return this ;
  },
  
  /**
    Notes that the data for the given record id has changed.  The record will
    be committed to the server the next time you commit the root store.  Only
    call this method on a record in a READY state of some type.
    
    @param {SC.Record} recordType the recordType
    @param {String} id the record id
    @param {Number} storeKey (optional) if passed, ignores recordType and id
    @param {String} key that changed (optional)
    @returns {SC.Store} receiver
  */
  recordDidChange: function(recordType, id, storeKey, key) {
    if (storeKey === undefined) storeKey = recordType.storeKeyFor(id);
    var status = this.readStatus(storeKey), changelog, K = SC.Record;
    
    // BUSY_LOADING, BUSY_CREATING, BUSY_COMMITTING, BUSY_REFRESH_CLEAN
    // BUSY_REFRESH_DIRTY, BUSY_DESTROYING
    if (status & K.BUSY) {
      throw K.BUSY_ERROR ;
      
    // if record is not in ready state, then it is not found.
    // ERROR, EMPTY, DESTROYED_CLEAN, DESTROYED_DIRTY
    } else if (!(status & K.READY)) {
      throw K.NOT_FOUND_ERROR ;
      
    // otherwise, make new status READY_DIRTY unless new.
    // K.READY_CLEAN, K.READY_DIRTY, ignore K.READY_NEW
    } else {
      if (status != K.READY_NEW) this.writeStatus(storeKey, K.READY_DIRTY);
    }
    
    // record data hash change
    this.dataHashDidChange(storeKey, null, null, key);
    
    // record in changelog
    changelog = this.changelog ;
    if (!changelog) changelog = this.changelog = SC.Set.create() ;
    changelog.add(storeKey);
    this.changelog = changelog;
    
    // if commit records is enabled
    if(this.get('commitRecordsAutomatically')){
      this.invokeLast(this.commitRecords);
    }
    
    return this ;
  },

  /**
    Mark a group of records as dirty.  The records will be committed to the
    server the next time you commit changes on the root store.  If you have a 
    set of record ids, marking them dirty this way can be faster than 
    retrieving each record and destroying it individually.
    
    You can pass either a single recordType or an array of recordTypes.  If
    you pass a single recordType, then the record type will be used for each
    record.  If you pass an array, then each id must have a matching record 
    type in the array.

    You can optionally pass an array of storeKeys instead of the recordType
    and ids.  In this case the first two parameters will be ignored.  This
    is usually only used by low-level internal methods.  
    
    @param {SC.Record|Array} recordTypes class or array of classes
    @param {Array} ids ids to destroy
    @param {Array} storeKeys (optional) store keys to destroy
    @returns {SC.Store} receiver
  */
  recordsDidChange: function(recordTypes, ids, storeKeys) {
     var len, isArray, idx, id, recordType, storeKey;
      if(storeKeys===undefined){
        len = ids.length;
        isArray = SC.typeOf(recordTypes) === SC.T_ARRAY;
        if (!isArray) recordType = recordTypes;
        for(idx=0;idx<len;idx++) {
          if (isArray) recordType = recordTypes[idx] || SC.Record;
          id = ids ? ids[idx] : undefined ;
          storeKey = storeKeys ? storeKeys[idx] : undefined ;
          this.recordDidChange(recordType, id, storeKey);
        }
      }else{
        len = storeKeys.length;
        for(idx=0;idx<len;idx++) {
          storeKey = storeKeys ? storeKeys[idx] : undefined ;
          this.recordDidChange(undefined, undefined, storeKey);
        }
      }
      return this ;  
  },

  /**
    Retrieves a set of records from the server.  If the records has 
    already been loaded in the store, then this method will simply return.  
    Otherwise if your store has a dataSource, this will call the 
    dataSource to retrieve the record.  Generally you will not need to 
    call this method yourself. Instead you can just use find().
    
    This will not actually create a record instance but it will initiate a 
    load of the record from the server.  You can subsequently get a record 
    instance itself using materializeRecord()
    
    @param {SC.Record|Array} recordTypes class or array of classes
    @param {Array} ids ids to retrieve
    @param {Array} storeKeys (optional) store keys to retrieve
    @param {Boolean} isRefresh
    @returns {Array} storeKeys to be retrieved
  */
  retrieveRecords: function(recordTypes, ids, storeKeys, isRefresh) {
    
    var source  = this._getDataSource(),
        isArray = SC.typeOf(recordTypes) === SC.T_ARRAY,
        len     = (!storeKeys) ? ids.length : storeKeys.length,
        ret     = [],
        rev     = SC.Store.generateStoreKey(),
        K       = SC.Record,
        recordType, idx, storeKey, status, ok;
        
    if (!isArray) recordType = recordTypes;
    
    // if no storeKeys were passed, map recordTypes + ids
    for(idx=0;idx<len;idx++) {
      
      // collect store key
      if (storeKeys) {
        storeKey = storeKeys[idx];
      } else {
        if (isArray) recordType = recordTypes[idx];
        storeKey = recordType.storeKeyFor(ids[idx]);
      }
      
      // collect status and process
      status = this.readStatus(storeKey);
      
      // K.EMPTY, K.ERROR, K.DESTROYED_CLEAN - initial retrieval
      if ((status == K.EMPTY) || (status == K.ERROR) || (status == K.DESTROYED_CLEAN)) {
        this.writeStatus(storeKey, K.BUSY_LOADING);
        this.dataHashDidChange(storeKey, rev, YES);
        ret.push(storeKey);

      // otherwise, ignore record unless isRefresh is YES.
      } else if (isRefresh) {
        // K.READY_CLEAN, K.READY_DIRTY, ignore K.READY_NEW
        if (status & K.READY) {
          this.writeStatus(storeKey, K.BUSY_REFRESH | (status & 0x03)) ;
          this.dataHashDidChange(storeKey, rev, YES);
          ret.push(storeKey);

        // K.BUSY_DESTROYING, K.BUSY_COMMITTING, K.BUSY_CREATING
        } else if ((status == K.BUSY_DESTROYING) || (status == K.BUSY_CREATING) || (status == K.BUSY_COMMITTING)) {
          throw K.BUSY_ERROR ;

        // K.DESTROY_DIRTY, bad state...
        } else if (status == K.DESTROYED_DIRTY) {
          throw K.BAD_STATE_ERROR ;
          
        // ignore K.BUSY_LOADING, K.BUSY_REFRESH_CLEAN, K.BUSY_REFRESH_DIRTY
        }
      }
    }
    
    // now retrieve storekeys from dataSource.  if there is no dataSource,
    // then act as if we couldn't retrieve.
    ok = NO;
    if (source) ok = source.retrieveRecords.call(source, this, ret, ids);

    // if the data source could not retrieve or if there is no source, then
    // simulate the data source calling dataSourceDidError on those we are 
    // loading for the first time or dataSourceDidComplete on refreshes.
    if (!ok) {
      len = ret.length;
      rev = SC.Store.generateStoreKey();
      for(idx=0;idx<len;idx++) {
        storeKey = ret[idx];
        status   = this.readStatus(storeKey);
        if (status === K.BUSY_LOADING) {
          this.writeStatus(storeKey, K.ERROR);
          this.dataHashDidChange(storeKey, rev, YES);
          
        } else if (status & K.BUSY_REFRESH) {
          this.writeStatus(storeKey, K.READY | (status & 0x03));
          this.dataHashDidChange(storeKey, rev, YES);
        }
      }
      ret.length = 0 ; // truncate to indicate that none could refresh
    }
    return ret ;
  },
  
  _TMP_RETRIEVE_ARRAY: [],
  
  /**
    Retrieves a record from the server.  If the record has already been loaded
    in the store, then this method will simply return.  Otherwise if your 
    store has a dataSource, this will call the dataSource to retrieve the 
    record.  Generally you will not need to call this method yourself.  
    Instead you can just use find().
    
    This will not actually create a record instance but it will initiate a 
    load of the record from the server.  You can subsequently get a record 
    instance itself using materializeRecord()

    @param {SC.Record} recordType class
    @param {String} id id to retrieve
    @param {Number} storeKey (optional) store key
    @param {Boolean} isRefresh
    @returns {Number} storeKey that was retrieved 
  */
  retrieveRecord: function(recordType, id, storeKey, isRefresh) {
    var array = this._TMP_RETRIEVE_ARRAY,
        ret;
    
    if (storeKey) {
      array[0] = storeKey;
      storeKey = array;
      id = null ;
    } else {
      array[0] = id;
      id = array;
    }
    
    ret = this.retrieveRecords(recordType, id, storeKey, isRefresh);
    array.length = 0 ;
    return ret[0];
  },

  /**
    Refreshes a record from the server.  If the record has already been loaded
    in the store, then this method will request a refresh from the dataSource.
    Otherwise it will attempt to retrieve the record.
    
    @param {String} id to id of the record to load
    @param {SC.Record} recordType the expected record type
    @param {Number} storeKey (optional) optional store key
    @returns {Boolean} YES if the retrieval was a success.
  */
  refreshRecord: function(recordType, id, storeKey) {
    return !!this.retrieveRecord(recordType, id, storeKey, YES);
  },

  /**
    Refreshes a set of records from the server.  If the records has already been loaded
    in the store, then this method will request a refresh from the dataSource.
    Otherwise it will attempt to retrieve them.
    
    @param {SC.Record|Array} recordTypes class or array of classes
    @param {Array} ids ids to destroy
    @param {Array} storeKeys (optional) store keys to destroy
    @returns {Boolean} YES if the retrieval was a success.
  */
  refreshRecords: function(recordTypes, ids, storeKeys) {
    var ret = this.retrieveRecords(recordTypes, ids, storeKeys, YES);
    return ret && ret.length>0;
  },
    
  /**
    Commits the passed store keys or ids. If no storeKeys are given 
    it will commit any records in the changelog. 
    
    Based on the current state of the record, this will ask the data 
    source to perform the appropriate actions
    on the store keys.
    
    @param {Array} recordTypes the expected record types (SC.Record)
    @param {Array} ids to commit
    @param {Array} storeKeys to commit
    @param {Hash} params optional additional parameters to pass along to the
      data source

    @returns {Boolean} if the action was succesful.
  */
  commitRecords: function(recordTypes, ids, storeKeys, params) {
    
    var source    = this._getDataSource(),
        isArray   = SC.typeOf(recordTypes) === SC.T_ARRAY,    
        retCreate= [], retUpdate= [], retDestroy = [], 
        rev       = SC.Store.generateStoreKey(),
        K         = SC.Record,
        recordType, idx, storeKey, status, key, ret, len ;

    // If no params are passed, look up storeKeys in the changelog property.
    // Remove any committed records from changelog property.

    if(!recordTypes && !ids && !storeKeys){
      storeKeys = this.changelog;
    }

    len = storeKeys ? storeKeys.get('length') : (ids ? ids.get('length') : 0);
    
    for(idx=0;idx<len;idx++) {
      
      // collect store key
      if (storeKeys) {
        storeKey = storeKeys[idx];
      } else {
        if (isArray) recordType = recordTypes[idx] || SC.Record;
        else recordType = recordTypes;
        storeKey = recordType.storeKeyFor(ids[idx]);
      }
      
      // collect status and process
      status = this.readStatus(storeKey);
      
      if ((status == K.EMPTY) || (status == K.ERROR)) {
        throw K.NOT_FOUND_ERROR ;
      } 
      else {
        if(status==K.READY_NEW) {
          this.writeStatus(storeKey, K.BUSY_CREATING);
          this.dataHashDidChange(storeKey, rev, YES);
          retCreate.push(storeKey);
        } else if (status==K.READY_DIRTY) {
          this.writeStatus(storeKey, K.BUSY_COMMITTING);
          this.dataHashDidChange(storeKey, rev, YES);
          retUpdate.push(storeKey);
        } else if (status==K.DESTROYED_DIRTY) {
          this.writeStatus(storeKey, K.BUSY_DESTROYING);
          this.dataHashDidChange(storeKey, rev, YES);
          retDestroy.push(storeKey);
        } else if (status==K.DESTROYED_CLEAN) {
          this.dataHashDidChange(storeKey, rev, YES);
        }
        // ignore K.READY_CLEAN, K.BUSY_LOADING, K.BUSY_CREATING, K.BUSY_COMMITTING, 
        // K.BUSY_REFRESH_CLEAN, K_BUSY_REFRESH_DIRTY, KBUSY_DESTROYING
      }
    }
    
    // now commit storekeys to dataSource
    if (source && (len>0 || params)) {
      ret = source.commitRecords.call(source, this, retCreate, retUpdate, retDestroy, params);
    }
    
    //remove all commited changes from changelog
    if (ret && !recordTypes && !ids && storeKeys===this.changelog){ 
      this.changelog = null; 
    }
    return ret ;
  },

  /**
    Commits the passed store key or id.  Based on the current state of the 
    record, this will ask the data source to perform the appropriate action
    on the store key.
    
    You have to pass either the id or the storeKey otherwise it will return 
    NO.
    
    @param {SC.Record} recordType the expected record type
    @param {String} id the id of the record to commit
    @param {Number} storeKey the storeKey of the record to commit
    @param {Hash} params optional additonal params that will passed down
      to the data source
    @returns {Boolean} if the action was successful.
  */
  commitRecord: function(recordType, id, storeKey, params) {
    var array = this._TMP_RETRIEVE_ARRAY,
        ret ;
    if (id === undefined && storeKey === undefined ) return NO;
    if (storeKey !== undefined) {
      array[0] = storeKey;
      storeKey = array;
      id = null ;
    } else {
      array[0] = id;
      id = array;
    }
    
    ret = this.commitRecords(recordType, id, storeKey, params);
    array.length = 0 ;
    return ret;
  },
  
  /**
    Cancels an inflight request for the passed records.  Depending on the 
    server implementation, this could cancel an entire request, causing 
    other records to also transition their current state.
    
    @param {SC.Record|Array} recordTypes class or array of classes
    @param {Array} ids ids to destroy
    @param {Array} storeKeys (optional) store keys to destroy
    @returns {SC.Store} the store.
  */
  cancelRecords: function(recordTypes, ids, storeKeys) {
    var source  = this._getDataSource(),
        isArray = SC.typeOf(recordTypes) === SC.T_ARRAY,
        K       = SC.Record,
        ret     = [],
        status, len, idx, id, recordType, storeKey;
        
    len = (storeKeys === undefined) ? ids.length : storeKeys.length;
    for(idx=0;idx<len;idx++) {
      if (isArray) recordType = recordTypes[idx] || SC.Record;
      else recordType = recordTypes || SC.Record;
      
      id = ids ? ids[idx] : undefined ;
      
      if(storeKeys===undefined){
        storeKey = recordType.storeKeyFor(id);
      }else{
        storeKey = storeKeys ? storeKeys[idx] : undefined ;        
      }
      if(storeKey) {
        status = this.readStatus(storeKey);

        if ((status == K.EMPTY) || (status == K.ERROR)) {
          throw K.NOT_FOUND_ERROR ;
        }
        ret.push(storeKey);
      }
    }
    
    if (source) source.cancel.call(source, this, ret);
    
    return this ;
  },

  /**
    Cancels an inflight request for the passed record.  Depending on the 
    server implementation, this could cancel an entire request, causing 
    other records to also transition their current state.
  
    @param {SC.Record|Array} recordTypes class or array of classes
    @param {Array} ids ids to destroy
    @param {Array} storeKeys (optional) store keys to destroy
    @returns {SC.Store} the store.
  */
  cancelRecord: function(recordType, id, storeKey) {
    var array = this._TMP_RETRIEVE_ARRAY,
        ret ;
        
    if (storeKey !== undefined) {
      array[0] = storeKey;
      storeKey = array;
      id = null ;
    } else {
      array[0] = id;
      id = array;
    }
    
    ret = this.cancelRecords(recordType, id, storeKey);
    array.length = 0 ;
    return this;
  },
  
  /** 
    Convenience method can be called by the store or other parts of your 
    application to load records into the store.  This method will take a
    recordType and an array of data hashes and either add or update the 
    record in the store. 
    
    The loaded records will be in an SC.Record.READY_CLEAN state, indicating
    they were loaded from the data source and do not need to be committed 
    back before changing.
    
    This method will check the state of each storeKey and call either 
    pushRetrieve() or dataSourceDidComplete().  The standard state constraints 
    for these methods apply here.
    
    The return value will be the storeKeys used for each push.  This is often
    convenient to pass into loadQuery(), if you are fetching a remote query.
    
    If you are upgrading from a pre SproutCore 1.0 application, this method 
    is the closest to the old updateRecords().
    
    @param {SC.Record} recordTypes the record type or array of record types
    @param {Array} dataHashes array of data hashes to update
    @param {Array} ids optional array of ids.  if not passed lookup on hashes
    @returns {Array} store keys assigned to these ids
  */
  loadRecords: function(recordTypes, dataHashes, ids) {
    var isArray = SC.typeOf(recordTypes) === SC.T_ARRAY,
        len     = dataHashes.get('length'),
        ret     = [],
        K       = SC.Record,
        recordType, id, primaryKey, idx, dataHash, storeKey;
        
    // save lookup info
    if (!isArray) {
      recordType = recordTypes || SC.Record;
      primaryKey = recordType.prototype.primaryKey ;
    }
    
    // push each record
    for(idx=0;idx<len;idx++) {
      dataHash = dataHashes.objectAt(idx);
      if (isArray) {
        recordType = recordTypes.objectAt(idx) || SC.Record;
        primaryKey = recordType.prototype.primaryKey ;
      }
      id = (ids) ? ids.objectAt(idx) : dataHash[primaryKey];
      ret[idx] = storeKey = recordType.storeKeyFor(id); // needed to cache
      
      if (this.readStatus(storeKey) & K.BUSY) {
        this.dataSourceDidComplete(storeKey, dataHash, id);
      } else this.pushRetrieve(recordType, id, dataHash, storeKey);
    }
    
    // return storeKeys
    return ret ;
  },

  /**
    Returns the SC.Error object associated with a specific record.

    @param {Number} storeKey The store key of the record.
 
    @returns {SC.Error} SC.Error or undefined if no error associated with the record.
  */
  readError: function(storeKey) {
    var errors = this.recordErrors ;
    return errors ? errors[storeKey] : undefined ;
  },

  /**
    Returns the SC.Error object associated with a specific query.

    @param {SC.Query} query The SC.Query with which the error is associated.
 
    @returns {SC.Error} SC.Error or undefined if no error associated with the query.
  */
  readQueryError: function(query) {
    var errors = this.queryErrors ;
    return errors ? errors[SC.guidFor(query)] : undefined ;
  },
  
  // ..........................................................
  // DATA SOURCE CALLBACKS
  // 
  // Mathods called by the data source on the store

  /**
    Called by a dataSource when it cancels an inflight operation on a 
    record.  This will transition the record back to it non-inflight state.
    
    @param {Number} storeKey record store key to cancel
    @returns {SC.Store} reciever
  */
  dataSourceDidCancel: function(storeKey) {
    var status = this.readStatus(storeKey), 
        K      = SC.Record;
    
    // EMPTY, ERROR, READY_CLEAN, READY_NEW, READY_DIRTY, DESTROYED_CLEAN,
    // DESTROYED_DIRTY
    if (!(status & K.BUSY)) {
      throw K.BAD_STATE_ERROR; // should never be called in this state
      
    }
    
    // otherwise, determine proper state transition
    switch(status) {
      case K.BUSY_LOADING:
        status = K.EMPTY;
        break ;
      
      case K.BUSY_CREATING:
        status = K.READY_NEW;
        break;
        
      case K.BUSY_COMMITTING:
        status = K.READY_DIRTY ;
        break;
        
      case K.BUSY_REFRESH_CLEAN:
        status = K.READY_CLEAN;
        break;
        
      case K.BUSY_REFRESH_DIRTY:
        status = K.READY_DIRTY ;
        break ;
        
      case K.BUSY_DESTROYING:
        status = K.DESTROYED_DIRTY ;
        break;
        
      default:
        throw K.BAD_STATE_ERROR ;
    } 
    this.writeStatus(storeKey, status) ;
    this.dataHashDidChange(storeKey, null, YES);
    
    return this ;
  },
  
  /**
    Called by a data source when it creates or commits a record.  Passing an
    optional id will remap the storeKey to the new record id.  This is 
    required when you commit a record that does not have an id yet.
    
    @param {Number} storeKey record store key to change to READY_CLEAN state
    @param {Hash} dataHash optional data hash to replace current hash
    @param {Object} newId optional new id to replace the old one
    @returns {SC.Store} reciever
  */
  dataSourceDidComplete: function(storeKey, dataHash, newId) {
    var status = this.readStatus(storeKey), K = SC.Record, statusOnly;
    
    // EMPTY, ERROR, READY_CLEAN, READY_NEW, READY_DIRTY, DESTROYED_CLEAN,
    // DESTROYED_DIRTY
    if (!(status & K.BUSY)) {
      throw K.BAD_STATE_ERROR; // should never be called in this state
    }
    
    // otherwise, determine proper state transition
    if(status===K.BUSY_DESTROYING) {
      throw K.BAD_STATE_ERROR ;
    } else status = K.READY_CLEAN ;

    this.writeStatus(storeKey, status) ;
    if (dataHash) this.writeDataHash(storeKey, dataHash, status) ;
    if (newId) SC.Store.replaceIdFor(storeKey, newId);
    
    statusOnly = dataHash || newId ? NO : YES;
    this.dataHashDidChange(storeKey, null, statusOnly);
    
    return this ;
  },
  
  /**
    Called by a data source when it has destroyed a record.  This will
    transition the record to the proper state.
    
    @param {Number} storeKey record store key to cancel
    @returns {SC.Store} reciever
  */
  dataSourceDidDestroy: function(storeKey) {
    var status = this.readStatus(storeKey), K = SC.Record;

    // EMPTY, ERROR, READY_CLEAN, READY_NEW, READY_DIRTY, DESTROYED_CLEAN,
    // DESTROYED_DIRTY
    if (!(status & K.BUSY)) {
      throw K.BAD_STATE_ERROR; // should never be called in this state
    }
    // otherwise, determine proper state transition
    else{
      status = K.DESTROYED_CLEAN ;
    } 
    this.removeDataHash(storeKey, status) ;
    this.dataHashDidChange(storeKey);

    return this ;
  },

  /**
    Converts the passed record into an error object.
    
    @param {Number} storeKey record store key to error
    @param {SC.Error} error [optional] an SC.Error instance to associate with storeKey
    @returns {SC.Store} reciever
  */
  dataSourceDidError: function(storeKey, error) {
    var status = this.readStatus(storeKey), errors = this.recordErrors, K = SC.Record;

    // EMPTY, ERROR, READY_CLEAN, READY_NEW, READY_DIRTY, DESTROYED_CLEAN,
    // DESTROYED_DIRTY
    if (!(status & K.BUSY)) throw K.BAD_STATE_ERROR; 

    // otherwise, determine proper state transition
    else status = K.ERROR ;

    // Add the error to the array of record errors (for lookup later on if necessary).
    if (error && error.isError) {
      if (!errors) errors = this.recordErrors = [];
      errors[storeKey] = error;
    }

    this.writeStatus(storeKey, status) ;
    this.dataHashDidChange(storeKey, null, YES);

    return this ;
  },

  // ..........................................................
  // PUSH CHANGES FROM DATA SOURCE
  // 
  
  /**
    Call by the data source whenever you want to push new data out of band 
    into the store.
    
    @param {Class} recordType the SC.Record subclass
    @param {Object} id the record id or null
    @param {Hash} dataHash data hash to load
    @param {Number} storeKey optional store key.  
    @returns {Boolean} YES if push was allowed
  */
  pushRetrieve: function(recordType, id, dataHash, storeKey) {
    var K = SC.Record, status;
    
    if(storeKey===undefined) storeKey = recordType.storeKeyFor(id);
    status = this.readStatus(storeKey);
    if(status==K.EMPTY || status==K.ERROR || status==K.READY_CLEAN || status==K.DESTROYED_CLEAN) {
      
      status = K.READY_CLEAN;
      if(dataHash===undefined) this.writeStatus(storeKey, status) ;
      else this.writeDataHash(storeKey, dataHash, status) ;

      this.dataHashDidChange(storeKey);
      
      return YES;
    }
    //conflicted (ready)
    return NO;
  },
  
  /**
    Call by the data source whenever you want to push a deletion into the 
    store.
    
    @param {Class} recordType the SC.Record subclass
    @param {Object} id the record id or null
    @param {Number} storeKey optional store key.  
    @returns {Boolean} YES if push was allowed
  */
  pushDestroy: function(recordType, id, storeKey) {
    var K = SC.Record, status;

    if(storeKey===undefined){
      storeKey = recordType.storeKeyFor(id);
    }
    status = this.readStatus(storeKey);
    if(status==K.EMPTY || status==K.ERROR || status==K.READY_CLEAN || status==K.DESTROY_CLEAN){
      status = K.DESTROY_CLEAN;
      this.removeDataHash(storeKey, status) ;
      this.dataHashDidChange(storeKey);
      return YES;
    }
    //conflicted (destroy)
    return NO;
  },

  /**
    Call by the data source whenever you want to push an error into the 
    store.
    
    @param {Class} recordType the SC.Record subclass
    @param {Object} id the record id or null
    @param {SC.Error} error [optional] an SC.Error instance to associate with id or storeKey
    @param {Number} storeKey optional store key.
    @returns {Boolean} YES if push was allowed
  */
  pushError: function(recordType, id, error, storeKey) {
    var K = SC.Record, status, errors = this.recordErrors;

    if(storeKey===undefined) storeKey = recordType.storeKeyFor(id);
    status = this.readStatus(storeKey);

    if(status==K.EMPTY || status==K.ERROR || status==K.READY_CLEAN || status==K.DESTROY_CLEAN){
      status = K.ERROR;
      
      // Add the error to the array of record errors (for lookup later on if necessary).
      if (error && error.isError) {
        if (!errors) errors = this.recordErrors = [];
        errors[storeKey] = error;
      }
      
      this.writeStatus(storeKey, status) ;
      this.dataHashDidChange(storeKey, null, YES);
      return YES;
    }
    //conflicted (error)
    return NO;
  },
  
  // ..........................................................
  // FETCH CALLBACKS
  // 
  
  // NOTE: although these method works on RecordArray instances right now.
  // They could be optimized to actually share query results between nested
  // stores.  This is why these methods are implemented here instead of 
  // directly on Query or RecordArray objects.
  
  /**
    Sets the passed array of storeKeys as the new data for the query.  You
    can call this at any time for a remote query to update its content.  If
    you want to use incremental loading, then pass a SparseArray object.
    
    If the query you pass is not a REMOTE query, then this method will raise
    an exception.  This will also implicitly transition the query state to 
    SC.Record.READY.
    
    If you called loadRecords() before to load the actual content, you can
    call this method with the return value of that method to actually set the
    storeKeys on the result.
    
    @param {SC.Query} query the query you are loading.  must be remote.
    @param {SC.Array} storeKeys array of store keys
    @returns {SC.Store} receiver
  */
  loadQueryResults: function(query, storeKeys) {
    if (query.get('location') === SC.Query.LOCAL) {
      throw new Error("Cannot load query results for a local query");
    }

    var recArray = this._findQuery(query, YES, NO);
    if (recArray) recArray.set('storeKeys', storeKeys);
    this.dataSourceDidFetchQuery(query);
    
    return this ;
  },
  
  /**
    Called by your data source whenever you finish fetching the results of a 
    query.  This will put the query into a READY state if it was loading.
    
    Note that if the query is a REMOTE query, then you must separately load 
    the results into the query using loadQuery().  If the query is LOCAL, then
    the query will update automatically with any new records you added to the
    store.
    
    @param {SC.Query} query the query you fetched
    @returns {SC.Store} receiver
  */
  dataSourceDidFetchQuery: function(query) {
    return this._scstore_dataSourceDidFetchQuery(query, YES);
  },
  
  _scstore_dataSourceDidFetchQuery: function(query, createIfNeeded) {
    var recArray     = this._findQuery(query, createIfNeeded, NO),
        nestedStores = this.get('nestedStores'),
        loc          = nestedStores ? nestedStores.get('length') : 0;
    
    // fix query if needed
    if (recArray) recArray.storeDidFetchQuery(query);
    
    // notify nested stores
    while(--loc >= 0) {
      nestedStores[loc]._scstore_dataSourceDidFetchQuery(query, NO);
    }
    
    return this ;
  },
  
  /**
    Called by your data source if it cancels fetching the results of a query.
    This will put any RecordArray's back into its original state (READY or
    EMPTY).
    
    @param {SC.Query} query the query you cancelled
    @returns {SC.Store} receiver
  */
  dataSourceDidCancelQuery: function(query) {
    return this._scstore_dataSourceDidCancelQuery(query, YES);
  },
  
  _scstore_dataSourceDidCancelQuery: function(query, createIfNeeded) {
    var recArray     = this._findQuery(query, createIfNeeded, NO),
        nestedStores = this.get('nestedStores'),
        loc          = nestedStores ? nestedStores.get('length') : 0;
    
    // fix query if needed
    if (recArray) recArray.storeDidCancelQuery(query);
    
    // notify nested stores
    while(--loc >= 0) {
      nestedStores[loc]._scstore_dataSourceDidCancelQuery(query, NO);
    }
    
    return this ;
  },
  
  /**
    Called by your data source if it encountered an error loading the query.
    This will put the query into an error state until you try to refresh it
    again.
    
    @param {SC.Query} query the query with the error
    @param {SC.Error} error [optional] an SC.Error instance to associate with query
    @returns {SC.Store} receiver
  */
  dataSourceDidErrorQuery: function(query, error) {
    var errors = this.queryErrors;

    // Add the error to the array of query errors (for lookup later on if necessary).
    if (error && error.isError) {
      if (!errors) errors = this.queryErrors = {};
      errors[SC.guidFor(query)] = error;
    }

    return this._scstore_dataSourceDidErrorQuery(query, YES);
  },

  _scstore_dataSourceDidErrorQuery: function(query, createIfNeeded) {
    var recArray     = this._findQuery(query, createIfNeeded, NO),
        nestedStores = this.get('nestedStores'),
        loc          = nestedStores ? nestedStores.get('length') : 0;

    // fix query if needed
    if (recArray) recArray.storeDidErrorQuery(query);

    // notify nested stores
    while(--loc >= 0) {
      nestedStores[loc]._scstore_dataSourceDidErrorQuery(query, NO);
    }

    return this ;
  },
    
  // ..........................................................
  // INTERNAL SUPPORT
  // 
  
  /** @private */
  init: function() {
    arguments.callee.base.apply(this,arguments);
    this.reset();
  },
  
  
  toString: function() {
    // Include the name if the client has specified one.
    var name = this.get('name');
    if (!name) {
      return arguments.callee.base.apply(this,arguments);
    }
    else {
      var ret = arguments.callee.base.apply(this,arguments);
      return "%@ (%@)".fmt(name, ret);
    }
  },


  // ..........................................................
  // PRIMARY KEY CONVENIENCE METHODS
  // 

  /** 
    Given a storeKey, return the primaryKey.
  
    @param {Number} storeKey the store key
    @returns {String} primaryKey value
  */
  idFor: function(storeKey) {
    return SC.Store.idFor(storeKey);
  },
  
  /**
    Given a storeKey, return the recordType.
    
    @param {Number} storeKey the store key
    @returns {SC.Record} record instance
  */
  recordTypeFor: function(storeKey) {
    return SC.Store.recordTypeFor(storeKey) ;
  },
  
  /**
    Given a recordType and primaryKey, find the storeKey. If the primaryKey 
    has not been assigned a storeKey yet, it will be added.
    
    @param {SC.Record} recordType the record type
    @param {String} primaryKey the primary key
    @returns {Number} storeKey
  */
  storeKeyFor: function(recordType, primaryKey) {
    return recordType.storeKeyFor(primaryKey);
  },
  
  /**
    Given a primaryKey value for the record, returns the associated
    storeKey.  As opposed to storeKeyFor() however, this method
    will NOT generate a new storeKey but returned undefined.
    
    @param {String} id a record id
    @returns {Number} a storeKey.
  */
  storeKeyExists: function(recordType, primaryKey) {
    return recordType.storeKeyExists(primaryKey);
  },
  
  /**
    Finds all storeKeys of a certain record type in this store
    and returns an array.
    
    @param {SC.Record} recordType
    @returns {Array} set of storeKeys
  */
  storeKeysFor: function(recordType) {
    var ret = [], 
        isEnum = recordType && recordType.isEnumerable,
        recType, storeKey, isMatch ;
    
    if (!this.statuses) return ret;
    for(storeKey in SC.Store.recordTypesByStoreKey) {
      recType = SC.Store.recordTypesByStoreKey[storeKey];
      
      // if same record type and this store has it
      if (isEnum) isMatch = recordType.contains(recType);
      else isMatch = recType === recordType;
      
      if(isMatch && this.statuses[storeKey]) ret.push(parseInt(storeKey, 0));
    }
    
    return ret;
  },
  
  /**
    Finds all storeKeys in this store
    and returns an array.
    
    @returns {Array} set of storeKeys
  */
  storeKeys: function() {
    var ret = [], storeKey;
    if(!this.statuses) return;
    
    for(storeKey in this.statuses) {
      // if status is not empty
      if(this.statuses[storeKey] != SC.Record.EMPTY) {
        ret.push(parseInt(storeKey,0));
      }
    }
    
    return ret;
  },
  
  /**
    Returns string representation of a storeKey, with status.
    
    @param {Number} storeKey
    @returns {String}
  */
  statusString: function(storeKey) {
    var rec = this.materializeRecord(storeKey);
    return rec.statusString();
  }
  
}) ;

SC.Store.mixin({
  
  /**
    Standard error raised if you try to commit changes from a nested store
    and there is a conflict.
    
    @property {Error}
  */
  CHAIN_CONFLICT_ERROR: new Error("Nested Store Conflict"),
  
  /**
    Standard error if you try to perform an operation on a nested store 
    without a parent.
  
    @property {Error}
  */
  NO_PARENT_STORE_ERROR: new Error("Parent Store Required"),
  
  /**
    Standard error if you try to perform an operation on a nested store that
    is only supported in root stores.
    
    @property {Error}
  */
  NESTED_STORE_UNSUPPORTED_ERROR: new Error("Unsupported In Nested Store"),
  
  /**
    Standard error if you try to retrieve a record in a nested store that is
    dirty.  (This is allowed on the main store, but not in nested stores.)
    
    @property {Error}
  */
  NESTED_STORE_RETRIEVE_DIRTY_ERROR: new Error("Cannot Retrieve Dirty Record in Nested Store"),

  /**
    Data hash state indicates the data hash is currently editable
    
    @property {String}
  */
  EDITABLE:  'editable',
  
  /**
    Data hash state indicates the hash no longer tracks changes from a 
    parent store, but it is not editable.
    
    @property {String}
  */
  LOCKED:    'locked',

  /**
    Data hash state indicates the hash is tracking changes from the parent
    store and is not editable.
    
    @property {String}
  */
  INHERITED: 'inherited',
  
  /** @private
    This array maps all storeKeys to primary keys.  You will not normally
    access this method directly.  Instead use the idFor() and 
    storeKeyFor() methods on SC.Record.
  */
  idsByStoreKey: [],
  
  /** @private
    Maps all storeKeys to a recordType.  Once a storeKey is associated with 
    a primaryKey and recordType that remains constant throughout the lifetime
    of the application.
  */
  recordTypesByStoreKey: {},
  
  /** @private
    Maps some storeKeys to query instance.  Once a storeKey is associated with
    a query instance, that remains constant through the lifetime of the 
    application.  If a Query is destroyed, it will remove itself from this 
    list.
    
    Don't access this directly.  Use queryFor().
  */
  queriesByStoreKey: [],
  
  /** @private
    The next store key to allocate.  A storeKey must always be greater than 0
  */
  nextStoreKey: 1,
  
  /**
    Generates a new store key for use.
    
    @property {Number}
  */
  generateStoreKey: function() { return this.nextStoreKey++; },
  
  /** 
    Given a storeKey returns the primaryKey associated with the key.
    If not primaryKey is associated with the storeKey, returns null.
    
    @param {Number} storeKey the store key
    @returns {String} the primary key or null
  */
  idFor: function(storeKey) {
    return this.idsByStoreKey[storeKey] ;
  },
  
  /**
    Given a storeKey, returns the query object associated with the key.  If
    no query is associated with the storeKey, returns null.
    
    @param {Number} storeKey the store key
    @returns {SC.Query} query query object
  */
  queryFor: function(storeKey) {
    return this.queriesByStoreKey[storeKey];  
  },
  
  /**
    Given a storeKey returns the SC.Record class associated with the key.
    If no record type is associated with the store key, returns null.
    
    The SC.Record class will only be found if you have already called
    storeKeyFor() on the record.
    
    @param {Number} storeKey the store key
    @returns {SC.Record} the record type
  */
  recordTypeFor: function(storeKey) {
    return this.recordTypesByStoreKey[storeKey];
  },
  
  /**
    Swaps the primaryKey mapped to the given storeKey with the new 
    primaryKey.  If the storeKey is not currently associated with a record
    this will raise an exception.
    
    @param {Number} storeKey the existing store key
    @param {String} newPrimaryKey the new primary key
    @returns {SC.Store} receiver
  */
  replaceIdFor: function(storeKey, newId) {
    var oldId = this.idsByStoreKey[storeKey],
        recordType, storeKeys;
        
    if (oldId !== newId) { // skip if id isn't changing

      recordType = this.recordTypeFor(storeKey);
       if (!recordType) {
        throw new Error("replaceIdFor: storeKey %@ does not exist".fmt(storeKey));
      }

      // map one direction...
      this.idsByStoreKey[storeKey] = newId; 

      // then the other...
      storeKeys = recordType.storeKeysById() ;
      delete storeKeys[oldId];
      storeKeys[newId] = storeKey;     
    }
    
    return this ;
  },
  
  /**
    Swaps the recordType recorded for a given storeKey.  Normally you should
    not call this method directly as it can damage the store behavior.  This
    method is used by other store methods to set the recordType for a 
    storeKey.
    
    @param {Integer} storeKey the store key
    @param {SC.Record} recordType a record class
    @returns {SC.Store} reciever
  */
  replaceRecordTypeFor: function(storeKey, recordType) {
    this.recordTypesByStoreKey[storeKey] = recordType;
    return this ;
  }
  
});


/** @private */
SC.Store.prototype.nextStoreIndex = 1;

// ..........................................................
// COMPATIBILITY
// 

/** @private
  global store is used only for deprecated compatibility methods.  Don't use
  this in real code.
*/
SC.Store._getDefaultStore = function() {
  var store = this._store;
  if(!store) this._store = store = SC.Store.create();
  return store;
};

/** @private

  DEPRECATED
  
  Included for compatibility, loads data hashes with the named recordType. 
  If no recordType is passed, expects to find a recordType property in the 
  data hashes.  dataSource and isLoaded params are ignored.
  
  Calls SC.Store#loadRecords() on the default store. Do not use this method in 
  new code.  
  
  @param {Array} dataHashes data hashes to import
  @param {Object} dataSource ignored
  @param {SC.Record} recordType default record type
  @param {Boolean} isLoaded ignored
  @returns {Array} SC.Record instances for loaded data hashes
*/
SC.Store.updateRecords = function(dataHashes, dataSource, recordType, isLoaded) {
  
  console.warn("SC.Store.updateRecords() is deprecated.  Use loadRecords() instead");
  
  var store = this._getDefaultStore(),
      len   = dataHashes.length,
      idx, ret;
      
  // if no recordType was passed, build an array of recordTypes from hashes
  if (!recordType) {
    recordType = [];
    for(idx=0;idx<len;idx++) recordType[idx] = dataHashes[idx].recordType;
  }
  
  // call new API.  Returns storeKeys
  ret = store.loadRecords(recordType, dataHashes);
  
  // map to SC.Record instances
  len = ret.length;
  for(idx=0;idx<len;idx++) ret[idx] = store.materializeRecord(ret[idx]);
  
  return ret ;
};

/** @private

  DEPRECATED 

  Finds a record with the passed guid on the default store.  This is included
  only for compatibility.  You should use the newer find() method defined on
  SC.Store instead.
  
  @param {String} guid the guid
  @param {SC.Record} recordType expected record type
  @returns {SC.Record} found record
*/
SC.Store.find = function(guid, recordType) {
  return this._getDefaultStore().find(recordType, guid);
};

/** @private

  DEPRECATED 

  Passes through to findAll on default store.  This is included only for 
  compatibility.  You should use the newer findAll() defined on SC.Store
  instead.
  
  @param {Hash} filter search parameters
  @param {SC.Record} recordType type of record to find
  @returns {SC.RecordArray} result set
*/
SC.Store.findAll = function(filter, recordType) {
  return this._getDefaultStore().findAll(filter, recordType);
};

/* >>>>>>>>>> BEGIN source/system/nested_store.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

sc_require('system/store');

/**
  @class

  A nested store can buffer changes to a parent store and then commit them
  all at once.  You usually will use a NestedStore as part of store chaining
  to stage changes to your object graph before sharing them with the rest of
  the application.
  
  Normally you will not create a nested store directly.  Instead, you can 
  retrieve a nested store by using the chain() method.  When you are finished
  working with the nested store, destroy() will dispose of it.
  
  @extends SC.Store
  @since SproutCore 1.0
*/
SC.NestedStore = SC.Store.extend(
/** @scope SC.NestedStore.prototype */ {

  /**
    This is set to YES when there are changes that have not been committed 
    yet.

    @property {Boolean}
    @default NO
  */
  hasChanges: NO,

  /**
    The parent store this nested store is chained to.  Nested stores must have
    a parent store in order to function properly.  Normally, you create a 
    nested store using the SC.Store#chain() method and this property will be
    set for you.
    
    @property {SC.Store}
  */
  parentStore: null,

  /**
    YES if the view is nested. Walk like a duck
    
    @property {Boolean}
  */
  isNested: YES,

  /**
    If YES, then the attribute hash state will be locked when you first 
    read the data hash or status.  This means that if you retrieve a record
    then change the record in the parent store, the changes will not be 
    visible to your nested store until you commit or discard changes.
    
    If NO, then the attribute hash will lock only when you write data.
    
    Normally you want to lock your attribute hash the first time you read it.
    This will make your nested store behave most consistently.  However, if
    you are using multiple sibling nested stores at one time, you may want
    to turn off this property so that changes from one store will be reflected
    in the other one immediately.  In this case you will be responsible for
    ensuring that the sibling stores do not edit the same part of the object
    graph at the same time.
    
    @property {Boolean} 
  */
  lockOnRead: YES,

  /** @private
    Array contains the base revision for an attribute hash when it was first
    cloned from the parent store.  If the attribute hash is edited and 
    commited, the commit will fail if the parent attributes hash has been 
    edited since.
    
    This is a form of optimistic locking, hence the name.
    
    Each store gets its own array of locks, which are selectively populated
    as needed.
    
    Note that this is kept as an array because it will be stored as a dense 
    array on some browsers, making it faster.
    
    @property {Array}
  */
  locks: null,

  /** @private
    An array that includes the store keys that have changed since the store
    was last committed.  This array is used to sync data hash changes between
    chained stores.  For a log changes that may actually be committed back to
    the server see the changelog property.
    
    @property {Array}
  */
  chainedChanges: null,
    
  // ..........................................................
  // STORE CHAINING
  // 
  
  /**
    find() cannot accept REMOTE queries in a nested store.  This override will
    verify that condition for you.  See SC.Store#find() for info on using this
    method.
    
    @returns {SC.Record|SC.RecordArray}
  */
  find: function(query) {
    if (query && query.isQuery && query.get('location') !== SC.Query.LOCAL) {
      throw "SC.Store#find() can only accept LOCAL queries in nested stores";
    }
    return arguments.callee.base.apply(this,arguments);
  },
  
  /**
    Propagate this store's changes to its parent.  If the store does not 
    have a parent, this has no effect other than to clear the change set.

    @param {Boolean} force if YES, does not check for conflicts first
    @returns {SC.Store} receiver
  */
  commitChanges: function(force) {
    if (this.get('hasChanges')) {
      var pstore = this.get('parentStore');
      pstore.commitChangesFromNestedStore(this, this.chainedChanges, force);
    }

    // clear out custom changes - even if there is nothing to commit.
    this.reset();
    return this ;
  },

  /**
    Discard the changes made to this store and reset the store.
    
    @returns {SC.Store} receiver
  */
  discardChanges: function() {
    
    // any locked records whose rev or lock rev differs from parent need to
    // be notified.
    var records, locks;
    if ((records = this.records) && (locks = this.locks)) {
      var pstore = this.get('parentStore'), psRevisions = pstore.revisions;
      var revisions = this.revisions, storeKey, lock, rev;
      for(storeKey in records) {
        if (!records.hasOwnProperty(storeKey)) continue ;
        if (!(lock = locks[storeKey])) continue; // not locked.

        rev = psRevisions[storeKey];
        if ((rev !== lock) || (revisions[storeKey] > rev)) {
          this._notifyRecordPropertyChange(storeKey);
        }
      }
    }
    
    this.reset();
    this.flush();
    return this ;
  },
  
  /**
    When you are finished working with a chained store, call this method to 
    tear it down.  This will also discard any pending changes.
    
    @returns {SC.Store} receiver
  */
  destroy: function() {
    this.discardChanges();
    
    var parentStore = this.get('parentStore');
    if (parentStore) parentStore.willDestroyNestedStore(this);
    
    arguments.callee.base.apply(this,arguments);  
    return this ;
  },

  /**
    Resets a store's data hash contents to match its parent.
    
    @returns {SC.Store} receiver
  */
  reset: function() {

    // requires a pstore to reset
    var parentStore = this.get('parentStore');
    if (!parentStore) throw SC.Store.NO_PARENT_STORE_ERROR;
    
    // inherit data store from parent store.
    this.dataHashes = SC.beget(parentStore.dataHashes);
    this.revisions  = SC.beget(parentStore.revisions);
    this.statuses   = SC.beget(parentStore.statuses);
    
    // also, reset private temporary objects
    this.chainedChanges = this.locks = this.editables = null;
    this.changelog = null ;

    // TODO: Notify record instances
    
    this.set('hasChanges', NO);
  },
  
  /** @private
  
    Chain to parentstore
  */
  refreshQuery: function(query) {
    var parentStore = this.get('parentStore');
    if (parentStore) parentStore.refreshQuery(query);
    return this ;      
  },

  /**
    Returns the SC.Error object associated with a specific record.

    Delegates the call to the parent store.

    @param {Number} storeKey The store key of the record.
 
    @returns {SC.Error} SC.Error or null if no error associated with the record.
  */
  readError: function(storeKey) {
    var parentStore = this.get('parentStore');
    return parentStore ? parentStore.readError(storeKey) : null;
  },

  /**
    Returns the SC.Error object associated with a specific query.

    Delegates the call to the parent store.

    @param {SC.Query} query The SC.Query with which the error is associated.
 
    @returns {SC.Error} SC.Error or null if no error associated with the query.
  */
  readQueryError: function(query) {
    var parentStore = this.get('parentStore');
    return parentStore ? parentStore.readQueryError(query) : null;
  },
  
  // ..........................................................
  // CORE ATTRIBUTE API
  // 
  // The methods in this layer work on data hashes in the store.  They do not
  // perform any changes that can impact records.  Usually you will not need 
  // to use these methods.
  
  /**
    Returns the current edit status of a storekey.  May be one of INHERITED,
    EDITABLE, and LOCKED.  Used mostly for unit testing.
    
    @param {Number} storeKey the store key
    @returns {Number} edit status
  */
  storeKeyEditState: function(storeKey) {
    var editables = this.editables, locks = this.locks;
    return (editables && editables[storeKey]) ? SC.Store.EDITABLE : (locks && locks[storeKey]) ? SC.Store.LOCKED : SC.Store.INHERITED ;
  },
   
  /**  @private
    Locks the data hash so that it iterates independently from the parent 
    store.
  */
  _lock: function(storeKey) {
    var locks = this.locks, rev, editables;
    
    // already locked -- nothing to do
    if (locks && locks[storeKey]) return this;

    // create locks if needed
    if (!locks) locks = this.locks = [];

    // fixup editables
    editables = this.editables;
    if (editables) editables[storeKey] = 0;
    
    
    // if the data hash in the parent store is editable, then clone the hash
    // for our own use.  Otherwise, just copy a reference to the data hash
    // in the parent store. -- find first non-inherited state
    var pstore = this.get('parentStore'), editState;
    while(pstore && (editState=pstore.storeKeyEditState(storeKey)) === SC.Store.INHERITED) {
      pstore = pstore.get('parentStore');
    }
    
    if (pstore && editState === SC.Store.EDITABLE) {
      this.dataHashes[storeKey] = SC.clone(pstore.dataHashes[storeKey]);
      if (!editables) editables = this.editables = [];
      editables[storeKey] = 1 ; // mark as editable
      
    } else this.dataHashes[storeKey] = this.dataHashes[storeKey];
    
    // also copy the status + revision
    this.statuses[storeKey] = this.statuses[storeKey];
    rev = this.revisions[storeKey] = this.revisions[storeKey];
    
    // save a lock and make it not editable
    locks[storeKey] = rev || 1;    
    
    return this ;
  },
  
  /** @private - adds chaining support */
  readDataHash: function(storeKey) {
    if (this.get('lockOnRead')) this._lock(storeKey);
    return this.dataHashes[storeKey];
  },
  
  /** @private - adds chaining support */
  readEditableDataHash: function(storeKey) {

    // lock the data hash if needed
    this._lock(storeKey);
    
    return arguments.callee.base.apply(this,arguments);
  },
  
  /** @private - adds chaining support - 
    Does not call sc_super because the implementation of the method vary too
    much. 
  */
  writeDataHash: function(storeKey, hash, status) {
    var locks = this.locks, rev ;
    
    // update dataHashes and optionally status.  Note that if status is not
    // passed, we want to copy the reference to the status anyway to lock it
    // in.
    if (hash) this.dataHashes[storeKey] = hash;
    this.statuses[storeKey] = status ? status : (this.statuses[storeKey] || SC.Record.READY_NEW);
    rev = this.revisions[storeKey] = this.revisions[storeKey]; // copy ref
    
    // make sure we lock if needed.
    if (!locks) locks = this.locks = [];
    if (!locks[storeKey]) locks[storeKey] = rev || 1;
    
    // also note that this hash is now editable
    var editables = this.editables;
    if (!editables) editables = this.editables = [];
    editables[storeKey] = 1 ; // use number for dense array support
    
    return this ;
  },

  /** @private - adds chaining support */
  removeDataHash: function(storeKey, status) {
    
    // record optimistic lock revision
    var locks = this.locks;
    if (!locks) locks = this.locks = [];
    if (!locks[storeKey]) locks[storeKey] = this.revisions[storeKey] || 1;

    return arguments.callee.base.apply(this,arguments);
  },
  
  /** @private - book-keeping for a single data hash. */
  dataHashDidChange: function(storeKeys, rev, statusOnly, key) {
    
    // update the revision for storeKey.  Use generateStoreKey() because that
    // gaurantees a universally (to this store hierarchy anyway) unique 
    // key value.
    if (!rev) rev = SC.Store.generateStoreKey();
    var isArray, len, idx, storeKey;
    
    isArray = SC.typeOf(storeKeys) === SC.T_ARRAY;
    if (isArray) {
      len = storeKeys.length;
    } else {
      len = 1;
      storeKey = storeKeys;
    }

    var changes = this.chainedChanges;
    if (!changes) changes = this.chainedChanges = SC.Set.create();
    
    for(idx=0;idx<len;idx++) {
      if (isArray) storeKey = storeKeys[idx];
      this._lock(storeKey);
      this.revisions[storeKey] = rev;
      changes.add(storeKey);
      this._notifyRecordPropertyChange(storeKey, statusOnly, key);
    }

    this.setIfChanged('hasChanges', YES);
    return this ;
  },

  // ..........................................................
  // SYNCING CHANGES
  // 
  
  /** @private - adapt for nested store */
  commitChangesFromNestedStore: function(nestedStore, changes, force) {

    arguments.callee.base.apply(this,arguments);
    
    // save a lock for each store key if it does not have one already
    // also add each storeKey to my own changes set.
    var pstore = this.get('parentStore'), psRevisions = pstore.revisions, i;
    var myLocks = this.locks, myChanges = this.chainedChanges,len,storeKey;
    if (!myLocks) myLocks = this.locks = [];
    if (!myChanges) myChanges = this.chainedChanges = SC.Set.create();

    len = changes.length ;
    for(i=0;i<len;i++) {
      storeKey = changes[i];
      if (!myLocks[storeKey]) myLocks[storeKey] = psRevisions[storeKey]||1;
      myChanges.add(storeKey);
    }
    
    // Finally, mark store as dirty if we have changes
    this.setIfChanged('hasChanges', myChanges.get('length')>0);
    this.flush();
    
    return this ;
  },

  // ..........................................................
  // HIGH-LEVEL RECORD API
  // 
  
  
  /** @private - adapt for nested store */
  queryFor: function(recordType, conditions, params) {
    return this.get('parentStore').queryFor(recordType, conditions, params);
  },
  
  /** @private - adapt for nested store */
  findAll: function(recordType, conditions, params, recordArray, _store) { 
    if (!_store) _store = this;
    return this.get('parentStore').findAll(recordType, conditions, params, recordArray, _store);
  },

  // ..........................................................
  // CORE RECORDS API
  // 
  // The methods in this section can be used to manipulate records without 
  // actually creating record instances.
  
  /** @private - adapt for nested store
  
    Unlike for the main store, for nested stores if isRefresh=YES, we'll throw
    an error if the record is dirty.  We'll otherwise avoid setting our status
    because that can disconnect us from upper and/or lower stores.
  */
  retrieveRecords: function(recordTypes, ids, storeKeys, isRefresh) {
    var pstore = this.get('parentStore'), idx, storeKey, newStatus,
      len = (!storeKeys) ? ids.length : storeKeys.length,
      K = SC.Record, status;

    // Is this a refresh?
    if (isRefresh) {
      for(idx=0;idx<len;idx++) {
        storeKey = !storeKeys ? pstore.storeKeyFor(recordTypes, ids[idx]) : storeKeys[idx];
        status   = this.peekStatus(storeKey);
        
        // We won't allow calling retrieve on a dirty record in a nested store
        // (although we do allow it in the main store).  This is because doing
        // so would involve writing a unique status, and that would break the
        // status hierarchy, so even though lower stores would complete the
        // retrieval, the upper layers would never inherit the new statuses.
        if (status & K.DIRTY) {
          throw SC.Store.NESTED_STORE_RETRIEVE_DIRTY_ERROR;
        }
        else {
          // Not dirty?  Then abandon any status we had set (to re-establish
          // any prototype linkage breakage) before asking our parent store to
          // perform the retrieve.
          var dataHashes = this.dataHashes,
              revisions  = this.revisions,
              statuses   = this.statuses,
              editables  = this.editables,
              locks      = this.locks;

          var changed    = NO;
          var statusOnly = NO;
  
          if (dataHashes  &&  dataHashes.hasOwnProperty(storeKey)) {
            delete dataHashes[storeKey];
            changed = YES;
          }
          if (revisions   &&  revisions.hasOwnProperty(storeKey)) {
            delete revisions[storeKey];
            changed = YES;
          }
          if (editables) delete editables[storeKey];
          if (locks) delete locks[storeKey];

          if (statuses  &&  statuses.hasOwnProperty(storeKey)) {
            delete statuses[storeKey];
            if (!changed) statusOnly = YES;
            changed = YES;
          }
          
          if (changed) this._notifyRecordPropertyChange(storeKey, statusOnly);
        }
      }
    }
    
    return pstore.retrieveRecords(recordTypes, ids, storeKeys, isRefresh);
  },

  /** @private - adapt for nested store */
  commitRecords: function(recordTypes, ids, storeKeys) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },

  /** @private - adapt for nested store */
  commitRecord: function(recordType, id, storeKey) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },
  
  /** @private - adapt for nested store */
  cancelRecords: function(recordTypes, ids, storeKeys) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },

  /** @private - adapt for nested store */
  cancelRecord: function(recordType, id, storeKey) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },
  
  // ..........................................................
  // DATA SOURCE CALLBACKS
  // 
  // Mathods called by the data source on the store

  /** @private - adapt for nested store */
  dataSourceDidCancel: function(storeKey) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },
  
  /** @private - adapt for nested store */
  dataSourceDidComplete: function(storeKey, dataHash, newId) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },
  
  /** @private - adapt for nested store */
  dataSourceDidDestroy: function(storeKey) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },

  /** @private - adapt for nested store */
  dataSourceDidError: function(storeKey, error) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },

  // ..........................................................
  // PUSH CHANGES FROM DATA SOURCE
  // 
  
  /** @private - adapt for nested store */
  pushRetrieve: function(recordType, id, dataHash, storeKey) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },
  
  /** @private - adapt for nested store */
  pushDestroy: function(recordType, id, storeKey) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  },

  /** @private - adapt for nested store */
  pushError: function(recordType, id, error, storeKey) {
    throw SC.Store.NESTED_STORE_UNSUPPORTED_ERROR;
  }
  
}) ;


/* >>>>>>>>>> BEGIN source/system/query.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

sc_require('core') ;
sc_require('models/record');

/**
  @class

  This permits you to perform queries on your data store,
  written in a SQL-like language. Here is a simple example:
    
  {{{
    q = SC.Query.create({
      conditions: "firstName = 'Jonny' AND lastName = 'Cash'"
    })
  }}}
    
  You can check if a certain record matches the query by calling:

  {{{
    q.contains(record)
  }}}
  
  To find all records of your store, that match query q, use findAll with
  query q as argument:
  
  {{{
    r = MyApp.store.findAll(q)
  }}}
  
  r will be a record array containing all matching records.
  To limit the query to a record type of MyApp.MyModel,
  you can specify the type as a property of the query like this:
  
  {{{
    q = SC.Query.create({ 
      conditions: "firstName = 'Jonny' AND lastName = 'Cash'",
      recordType: MyApp.MyModel 
    })
  }}}
  
  Calling find() like above will now return only records of type t.
  It is recommended to limit your query to a record type, since the query will
  have to look for matching records in the whole store, if no record type
  is given.
  
  You can give an order, which the resulting records should follow, like this:
  
  {{{
    q = SC.Query.create({ 
      conditions: "firstName = 'Jonny' AND lastName = 'Cash'",
      recordType: MyApp.MyModel,
      orderBy: "lastName, year DESC" 
    });
  }}}
  
  The default order direction is ascending. You can change it to descending
  by writing DESC behind the property name like in the example above.
  If no order is given, or records are equal in respect to a given order,
  records will be ordered by guid.

  h2. SproutCore Query Language
  
  Features of the query language:
  
  h4. Primitives:

  - record properties
  - null, undefined
  - true, false
  - numbers (integers and floats)
  - strings (double or single quoted)
  
  h4. Parameters:

  - %@ (wild card)
  - {parameterName} (named parameter)

  Wild cards are used to identify parameters by the order in which they appear 
  in the query string. Named parameters can be used when tracking the order 
  becomes difficult. Both types of parameters can be used by giving the 
  parameters as a property to your query object:
  
  {{{
    yourQuery.parameters = yourParameters
  }}}
  
  where yourParameters should have one of the following formats:

    for wild cards: [firstParam, secondParam, thirdParam]
    for named params: {name1: param1, mane2: parma2}

  You cannot use both types of parameters in a single query!
  
  h4. Operators:
  
  - =
  - !=
  - <
  - <=
  - >
  - >=
  - BEGINS_WITH (checks if a string starts with another one)
  - ENDS_WITH   (checks if a string ends with another one)
  - CONTAINS    (checks if a string contains another one, or if an object is in an array)
  - MATCHES     (checks if a string is matched by a regexp,
                you will have to use a parameter to insert the regexp)
  - ANY         (checks if the thing on its left is contained in the array
                on its right, you will have to use a parameter
                to insert the array)
  - TYPE_IS     (unary operator expecting a string containing the name 
                of a Model class on its right side, only records of this type
                will match)
    
  h4. Boolean Operators:
  
  - AND
  - OR
  - NOT
  
  h4. Parenthesis for grouping:
  
  - ( and )


  h2. Adding Your Own Query Handlers

  You can extend the query language with your own operators by calling:

  {{{
    SC.Query.registerQueryExtension('your_operator', your_operator_definition);
  }}}

  See details below. As well you can provide your own comparison functions
  to control ordering of specific record properties like this:

  {{{
    SC.Query.registerComparison(property_name, comparison_for_this_property);
  }}}
  
  h2. Examples
  
  Some example queries:
  
  TODO add examples

  @extends SC.Object
  @extends SC.Copyable
  @extends SC.Freezable
  @since SproutCore 1.0
*/

SC.Query = SC.Object.extend(SC.Copyable, SC.Freezable, 
  /** @scope SC.Query.prototype */ {

  // ..........................................................
  // PROPERTIES
  // 
  
  /** 
    Walk like a duck.
    
    @property {Boolean}
  */
  isQuery: YES,
  
  /**
    Unparsed query conditions.  If you are handling a query yourself, then 
    you will find the base query string here.
    
    @property {String}
  */
  conditions:  null,
  
  /**
    Optional orderBy parameters.  This will be a string of keys, optionally
    beginning with the strings "DESC " or "ASC " to select descending or 
    ascending order.
    
    @property {String}
  */
  orderBy:     null,
  
  /**
    The base record type or types for the query.  This must be specified to
    filter the kinds of records this query will work on.  You may either 
    set this to a single record type or to an array or set of record types.
    
    @property {SC.Record}
  */
  recordType:  null,
  
  /**
    Optional array of multiple record types.  If the query accepts multiple 
    record types, this is how you can check for it.
    
    @property {SC.Enumerable}
  */
  recordTypes: null,
  
  /**
    Returns the complete set of recordTypes matched by this query.  Includes
    any named recordTypes plus their subclasses.
    
    @property {SC.Enumerable}
  */
  expandedRecordTypes: function() {
    var ret = SC.CoreSet.create(), rt, q  ;
    
    if (rt = this.get('recordType')) this._scq_expandRecordType(rt, ret);      
    else if (rt = this.get('recordTypes')) {
      rt.forEach(function(t) { this._scq_expandRecordType(t, ret); }, this);
    } else this._scq_expandRecordType(SC.Record, ret);

    // save in queue.  if a new recordtype is defined, we will be notified.
    q = SC.Query._scq_queriesWithExpandedRecordTypes;
    if (!q) {
      q = SC.Query._scq_queriesWithExpandedRecordTypes = SC.CoreSet.create();
    }
    q.add(this);
    
    return ret.freeze() ;
  }.property('recordType', 'recordTypes').cacheable(),

  /** @private 
    expands a single record type into the set. called recursively
  */
  _scq_expandRecordType: function(recordType, set) {
    if (set.contains(recordType)) return; // nothing to do
    set.add(recordType);
    
    if (SC.typeOf(recordType)===SC.T_STRING) {
      recordType = SC.objectForPropertyPath(recordType);
    }
    
    recordType.subclasses.forEach(function(t) { 
      this._scq_expandRecordType(t, set);
    }, this);  
  },
  
  /**
    Optional hash of parameters.  These parameters may be interpolated into 
    the query conditions.  If you are handling the query manually, these 
    parameters will not be used.
    
    @property {Hash}
  */
  parameters:  null,
  
  /**
    Indicates the location where the result set for this query is stored.  
    Currently the available options are:
    
    - SC.Query.LOCAL: indicates that the query results will be automatically computed from the in-memory store.
    - SC.Query.REMOTE: indicates that the query results are kept on a remote server and hence must be loaded from the DataSource.
    
    The default setting for this property is SC.Query.LOCAL.  
    
    Note that even if a query location is LOCAL, your DataSource will still
    have its fetch() method called for the query.  For LOCAL queries, you 
    won't need to explicitly provide the query result set; you can just load
    records into the in-memory store as needed and let the query recompute 
    automatically.
    
    If your query location is REMOTE, then your DataSource will need to 
    provide the actual set of query results manually.  Usually you will only 
    need to use a REMOTE query if you are retrieving a large data set and you
    don't want to pay the cost of computing the result set client side.
    
    @property {String}
  */
  location: 'local', // SC.Query.LOCAL
  
  /**
    Another query that will optionally limit the search of records.  This is 
    usually configured for you when you do find() from another record array.
    
    @property {SC.Query}
  */
  scope: null,
  
  
  /**
    Returns YES if query location is Remote.  This is sometimes more 
    convenient than checking the location.
    
    @property {Boolean}
  */
  isRemote: function() {
    return this.get('location') === SC.Query.REMOTE;
  }.property('location').cacheable(),

  /**
    Returns YES if query location is Local.  This is sometimes more 
    convenient than checking the location.
    
    @property {Boolean}
  */
  isLocal: function() {
    return this.get('location') === SC.Query.LOCAL;
  }.property('location').cacheable(),
  
  /**
    Indicates whether a record is editable or not.  Defaults to NO.  Local
    queries should never be made editable.  Remote queries may be editable or
    not depending on the data source.
  */
  isEditable: NO,
  
  // ..........................................................
  // PRIMITIVE METHODS
  // 
  
  /** 
    Returns YES if record is matched by the query, NO otherwise.  This is 
    used when computing a query locally.  
 
    @param {SC.Record} record the record to check
    @param {Hash} parameters optional override parameters
    @returns {Boolean} YES if record belongs, NO otherwise
  */ 
  contains: function(record, parameters) {

    // check the recordType if specified
    var rtype, ret = YES ;    
    if (rtype = this.get('recordTypes')) { // plural form
      ret = rtype.find(function(t) { return SC.kindOf(record, t); });
    } else if (rtype = this.get('recordType')) { // singular
      ret = SC.kindOf(record, rtype);
    }
    
    if (!ret) return NO ; // if either did not pass, does not contain

    // if we have a scope - check for that as well
    var scope = this.get('scope');
    if (scope && !scope.contains(record)) return NO ;
    
    // now try parsing
    if (!this._isReady) this.parse(); // prepare the query if needed
    if (!this._isReady) return NO ;
    if (parameters === undefined) parameters = this.parameters || this;
    
    // if parsing worked we check if record is contained
    // if parsing failed no record will be contained
    return this._tokenTree.evaluate(record, parameters);
  },
  
  /**
    Returns YES if the query matches one or more of the record types in the
    passed set.
    
    @param {SC.Set} types set of record types
    @returns {Boolean} YES if record types match
  */
  containsRecordTypes: function(types) {
    var rtype = this.get('recordType');
    if (rtype) {
      return !!types.find(function(t) { return SC.kindOf(t, rtype); });
    
    } else if (rtype = this.get('recordTypes')) {
      return !!rtype.find(function(t) { 
        return !!types.find(function(t2) { return SC.kindOf(t2,t); });
      });
      
    } else return YES; // allow anything through
  },
  
  /**
    Returns the sort order of the two passed records, taking into account the
    orderBy property set on this query.  This method does not verify that the
    two records actually belong in the query set or not; this is checked using
    contains().
 
    @param {SC.Record} record1 the first record
    @param {SC.Record} record2 the second record
    @returns {Number} -1 if record1 < record2, 
                      +1 if record1 > record2,
                      0 if equal
  */
  compare: function(record1, record2) {

    var result = 0, 
        propertyName, order, len, i;

    // fast cases go here
    if (record1 === record2) return 0;
    
    // if called for the first time we have to build the order array
    if (!this._isReady) this.parse();
    if (!this._isReady) { // can't parse. guid is wrong but consistent
      return SC.compare(record1.get('id'),record2.get('id'));
    }
    
    // for every property specified in orderBy until non-eql result is found
    order = this._order;
    len   = order ? order.length : 0;
    for (i=0; result===0 && (i < len); i++) {
      propertyName = order[i].propertyName;
      // if this property has a registered comparison use that
      if (SC.Query.comparisons[propertyName]) {
        result = SC.Query.comparisons[propertyName](
                  record1.get(propertyName),record2.get(propertyName));
                  
      // if not use default SC.compare()
      } else {
        result = SC.compare(
                  record1.get(propertyName), record2.get(propertyName) );
      }
      
      if ((result!==0) && order[i].descending) result = (-1) * result;
    }

    // return result or compare by guid
    if (result !== 0) return result ;
    else return SC.compare(record1.get('id'),record2.get('id'));
  },

  /** @private 
      Becomes YES once the query has been successfully parsed 
  */
  _isReady:     NO,
  
  /**
    This method has to be called before the query object can be used.
    You will normaly not have to do this, it will be called automatically
    if you try to evaluate a query.
    You can however use this function for testing your queries.
 
    @returns {Boolean} true if parsing succeeded, false otherwise
  */
  parse: function() {
    var conditions = this.get('conditions'),
        lang       = this.get('queryLanguage'),
        tokens, tree;
        
    tokens = this._tokenList = this.tokenizeString(conditions, lang);
    tree = this._tokenTree = this.buildTokenTree(tokens, lang);
    this._order = this.buildOrder(this.get('orderBy'));
    
    this._isReady = !!tree && !tree.error;
    if (tree && tree.error) throw tree.error;
    return this._isReady;
  },
  
  /**
    Returns the same query but with the scope set to the passed record array.
    This will copy the receiver.  It also stores these queries in a cache to
    reuse them if possible.
    
    @param {SC.RecordArray} recordArray the scope
    @returns {SC.Query} new query
  */
  queryWithScope: function(recordArray) {
    // look for a cached query on record array.
    var key = SC.keyFor('__query__', SC.guidFor(this)),
        ret = recordArray[key];
        
    if (!ret) {
      recordArray[key] = ret = this.copy();
      ret.set('scope', recordArray);
      ret.freeze();
    }
    
    return ret ;
  },
  
  // ..........................................................
  // PRIVATE SUPPORT
  // 

  /** @private
    Properties that need to be copied when cloning the query.
  */
  copyKeys: 'conditions orderBy recordType recordTypes parameters location scope'.w(),
  
  /** @private */
  concatenatedProperties: 'copyKeys'.w(),

  /** @private 
    Implement the Copyable API to clone a query object once it has been 
    created.
  */
  copy: function() {
    var opts = {}, 
        keys = this.get('copyKeys'),
        loc  = keys ? keys.length : 0,
        key, value, ret;
        
    while(--loc >= 0) {
      key = keys[loc];
      value = this.get(key);
      if (value !== undefined) opts[key] = value ;
    }
    
    ret = this.constructor.create(opts);
    opts = null;
    return ret ;
  },

  // ..........................................................
  // QUERY LANGUAGE DEFINITION
  //
  
  
  /**
    This is the definition of the query language. You can extend it
    by using SC.Query.registerQueryExtension().
  */
  queryLanguage: {
    
    'UNKNOWN': {
      firstCharacter:   /[^\s'"\w\d\(\)\{\}]/,
      notAllowed:       /[\s'"\w\d\(\)\{\}]/
    },

    'PROPERTY': {
      firstCharacter:   /[a-zA-Z_]/,
      notAllowed:       /[^a-zA-Z_0-9]/,
      evalType:         'PRIMITIVE',
      
      /** @ignore */
      evaluate:         function (r,w) { return r.get(this.tokenValue); }
    },

    'NUMBER': {
      firstCharacter:   /\d/,
      notAllowed:       /[^\d\.]/,
      format:           /^\d+$|^\d+\.\d+$/,
      evalType:         'PRIMITIVE',
      
      /** @ignore */
      evaluate:         function (r,w) { return parseFloat(this.tokenValue); }
    },

    'STRING': {
      firstCharacter:   /['"]/,
      delimeted:        true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return this.tokenValue; }
    },

    'PARAMETER': {
      firstCharacter:   /\{/,
      lastCharacter:    '}',
      delimeted:        true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return w[this.tokenValue]; }
    },

    '%@': {
      rememberCount:    true,
      reservedWord:     true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return w[this.tokenValue]; }
    },

    'OPEN_PAREN': {
      firstCharacter:   /\(/,
      singleCharacter:  true
    },

    'CLOSE_PAREN': {
      firstCharacter:   /\)/,
      singleCharacter:  true
    },

    'AND': {
      reservedWord:     true,
      leftType:         'BOOLEAN',
      rightType:        'BOOLEAN',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var left  = this.leftSide.evaluate(r,w);
                          var right = this.rightSide.evaluate(r,w);
                          return left && right;
                        }
    },

    'OR': {
      reservedWord:     true,
      leftType:         'BOOLEAN',
      rightType:        'BOOLEAN',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var left  = this.leftSide.evaluate(r,w);
                          var right = this.rightSide.evaluate(r,w);
                          return left || right;
                        }
    },

    'NOT': {
      reservedWord:     true,
      rightType:        'BOOLEAN',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var right = this.rightSide.evaluate(r,w);
                          return !right;
                        }
    },

    '=': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var left  = this.leftSide.evaluate(r,w);
                          var right = this.rightSide.evaluate(r,w);
                          return left == right;
                        }
    },

    '!=': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var left  = this.leftSide.evaluate(r,w);
                          var right = this.rightSide.evaluate(r,w);
                          return left != right;
                        }
    },

    '<': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var left  = this.leftSide.evaluate(r,w);
                          var right = this.rightSide.evaluate(r,w);
                          return left < right;
                        }
    },

    '<=': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var left  = this.leftSide.evaluate(r,w);
                          var right = this.rightSide.evaluate(r,w);
                          return left <= right;
                        }
    },

    '>': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var left  = this.leftSide.evaluate(r,w);
                          var right = this.rightSide.evaluate(r,w);
                          return left > right;
                        }
    },

    '>=': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var left  = this.leftSide.evaluate(r,w);
                          var right = this.rightSide.evaluate(r,w);
                          return left >= right;
                        }
    },

    'BEGINS_WITH': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var all   = this.leftSide.evaluate(r,w);
                          var start = this.rightSide.evaluate(r,w);
                          return ( all.indexOf(start) === 0 );
                        }
    },

    'ENDS_WITH': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var all = this.leftSide.evaluate(r,w);
                          var end = this.rightSide.evaluate(r,w);
                          return ( all.indexOf(end) === (all.length - end.length) );
                        }
    },

    'CONTAINS': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
        evaluate:       function (r,w) {
                          var all    = this.leftSide.evaluate(r,w) || [];
                          var value = this.rightSide.evaluate(r,w);
                          switch(SC.typeOf(all)) {
                            case SC.T_STRING:
                              return (all.indexOf(value) !== -1); 
                            case SC.T_ARRAY:
                              var found  = false;
                              var i      = 0;
                              while ( found===false && i<all.length ) {
                                if ( value == all[i] ) found = true;
                                i++;
                              }
                              return found;
                            default:
                              //do nothing
                              break;
                          }
                        }
    },

    'ANY': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var prop   = this.leftSide.evaluate(r,w);
                          var values = this.rightSide.evaluate(r,w);
                          var found  = false;
                          var i      = 0;
                          while ( found===false && i<values.length ) {
                            if ( prop == values[i] ) found = true;
                            i++;
                          }
                          return found;
                        }
    },

    'MATCHES': {
      reservedWord:     true,
      leftType:         'PRIMITIVE',
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var toMatch = this.leftSide.evaluate(r,w);
                          var matchWith = this.rightSide.evaluate(r,w);
                          return matchWith.test(toMatch);
                        }
    },

    'TYPE_IS': {
      reservedWord:     true,
      rightType:        'PRIMITIVE',
      evalType:         'BOOLEAN',

      /** @ignore */
      evaluate:         function (r,w) {
                          var actualType = SC.Store.recordTypeFor(r.storeKey);
                          var right      = this.rightSide.evaluate(r,w);
                          var expectType = SC.objectForPropertyPath(right);
                          return actualType == expectType;
                        }
    },

    'null': {
      reservedWord:     true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return null; }
    },

    'undefined': {
      reservedWord:     true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return undefined; }
    },

    'false': {
      reservedWord:     true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return false; }
    },

    'true': {
      reservedWord:     true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return true; }
    },
    
    'YES': {
      reservedWord:     true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return true; }
    },
    
    'NO': {
      reservedWord:     true,
      evalType:         'PRIMITIVE',

      /** @ignore */
      evaluate:         function (r,w) { return false; }
    }
    
  },
  

  // ..........................................................
  // TOKENIZER
  //
  
  
  /**
    Takes a string and tokenizes it based on the grammar definition
    provided. Called by parse().
    
    @param {String} inputString the string to tokenize
    @param {Object} grammar the grammar definition (normally queryLanguage)
    @returns {Array} list of tokens
  */
  tokenizeString: function (inputString, grammar) {
	
	
    var tokenList           = [],
        c                   = null,
        t                   = null,
        token               = null,
        tokenType           = null,
        currentToken        = null,
        currentTokenType    = null,
        currentTokenValue   = null,
        currentDelimeter    = null,
        endOfString         = false,
        endOfToken          = false,
        belongsToToken      = false,
        skipThisCharacter   = false,
        rememberCount       = {};
  
  
    // helper function that adds tokens to the tokenList
  
    function addToken (tokenType, tokenValue) {
      t = grammar[tokenType];
      //tokenType = t.tokenType;
      
      // handling of special cases
      // check format
      if (t.format && !t.format.test(tokenValue)) tokenType = "UNKNOWN";
      // delimeted token (e.g. by ")
      if (t.delimeted) skipThisCharacter = true;
      
      // reserved words
      if ( !t.delimeted ) {
        for ( var anotherToken in grammar ) {
          if ( grammar[anotherToken].reservedWord
               && anotherToken == tokenValue ) {
            tokenType = anotherToken;
          }
        }
      }
      
      // reset t
      t = grammar[tokenType];
      // remembering count type
      if ( t && t.rememberCount ) {
        if (!rememberCount[tokenType]) rememberCount[tokenType] = 0;
        tokenValue = rememberCount[tokenType];
        rememberCount[tokenType] += 1;
      }

      // push token to list
      tokenList.push( {tokenType: tokenType, tokenValue: tokenValue} );

      // and clean up currentToken
      currentToken      = null;
      currentTokenType  = null;
      currentTokenValue = null;
    }
  
  
    // stepping through the string:
    
    if (!inputString) return [];
    
    var iStLength = inputString.length;
    
    for (var i=0; i < iStLength; i++) {
      
      // end reached?
      endOfString = (i===iStLength-1);
      
      // current character
      c = inputString.charAt(i);
    
      // set true after end of delimeted token so that
      // final delimeter is not catched again
      skipThisCharacter = false;
        
    
      // if currently inside a token
    
      if ( currentToken ) {
      
        // some helpers
        t = grammar[currentToken];
        endOfToken = t.delimeted ? c===currentDelimeter : t.notAllowed.test(c);
      
        // if still in token
        if ( !endOfToken ) currentTokenValue += c;
      
        // if end of token reached
        if (endOfToken || endOfString) {
          addToken(currentToken, currentTokenValue);
        }
      
        // if end of string don't check again
        if ( endOfString && !endOfToken ) skipThisCharacter = true;
      }
    
      // if not inside a token, look for next one
    
      if ( !currentToken && !skipThisCharacter ) {
        // look for matching tokenType
        for ( token in grammar ) {
          t = grammar[token];
          if (t.firstCharacter && t.firstCharacter.test(c)) {
            currentToken = token;
          }
        }

        // if tokenType found
        if ( currentToken ) {
          t = grammar[currentToken];
          currentTokenValue = c;
          // handling of special cases
          if ( t.delimeted ) {
            currentTokenValue = "";
            if ( t.lastCharacter ) currentDelimeter = t.lastCharacter;
            else currentDelimeter = c;
          }

          if ( t.singleCharacter || endOfString ) {
            addToken(currentToken, currentTokenValue);
          }
        }
      }
    }
    
    return tokenList;
  },
  
  
  
  // ..........................................................
  // BUILD TOKEN TREE
  //
  
  /**
    Takes an array of tokens and returns a tree, depending on the
    specified tree logic. The returned object will have an error property
    if building of the tree failed. Check it to get some information
    about what happend.
    If everything worked the tree can be evaluated by calling:
    
      tree.evaluate(record, parameters)
    
    If tokenList is empty, a single token will be returned which will
    evaluate to true for all records.
    
    @param {Array} tokenList the list of tokens
    @param {Object} treeLogic the logic definition (normally queryLanguage)
    @returns {Object} token tree
  */
  buildTokenTree: function (tokenList, treeLogic) {
  
    var l                    = tokenList.slice();
    var i                    = 0;
    var openParenthesisStack = [];
    var shouldCheckAgain     = false;
    var error                = [];
    
  
    // empty tokenList is a special case
    if (!tokenList || tokenList.length === 0) {
      return { evaluate: function(){ return true; } };
    }
  
  
    // some helper functions
  
    function tokenLogic (position) {
      var p = position;
      if ( p < 0 ) return false;
      
      var tl = treeLogic[l[p].tokenType];
      
      if ( ! tl ) {
        error.push("logic for token '"+l[p].tokenType+"' is not defined");
        return false;
      }

      // save evaluate in token, so that we don't have
      // to look it up again when evaluating the tree
      l[p].evaluate = tl.evaluate;
      return tl;
    }
  
    function expectedType (side, position) {
      var p = position;
      var tl = tokenLogic(p);
      if ( !tl )            return false;
      if (side == 'left')   return tl.leftType;
      if (side == 'right')  return tl.rightType;
    }
  
    function evalType (position) {
      var p = position;
      var tl = tokenLogic(p);
      if ( !tl )  return false;
      else        return tl.evalType;
    }
  
    function removeToken (position) {
      l.splice(position, 1);
      if ( position <= i ) i--;
    }
  
    function preceedingTokenExists (position) {
      var p = position || i;
      if ( p > 0 )  return true;
      else          return false;
    }
  
    function tokenIsMissingChilds (position) {
      var p = position;
      if ( p < 0 )  return true;
      return (expectedType('left',p) && !l[p].leftSide)
          || (expectedType('right',p) && !l[p].rightSide);
    }
  
    function typesAreMatching (parent, child) {
      var side = (child < parent) ? 'left' : 'right';
      if ( parent < 0 || child < 0 )                      return false;
      if ( !expectedType(side,parent) )                   return false;
      if ( !evalType(child) )                             return false;
      if ( expectedType(side,parent) == evalType(child) ) return true;
      else                                                return false;
    }
  
    function preceedingTokenCanBeMadeChild (position) {
      var p = position;
      if ( !tokenIsMissingChilds(p) )   return false;
      if ( !preceedingTokenExists(p) )  return false;
      if ( typesAreMatching(p,p-1) )    return true;
      else                              return false;
    }
  
    function preceedingTokenCanBeMadeParent (position) {
      var p = position;
      if ( tokenIsMissingChilds(p) )    return false;
      if ( !preceedingTokenExists(p) )  return false;
      if ( !tokenIsMissingChilds(p-1) ) return false;
      if ( typesAreMatching(p-1,p) )    return true;
      else                              return false;
    }
  
    function makeChild (position) {
      var p = position;
      if (p<1) return false;
      l[p].leftSide = l[p-1];
      removeToken(p-1);
    }
  
    function makeParent (position) {
      var p = position;
      if (p<1) return false;
      l[p-1].rightSide = l[p];
      removeToken(p);
    }
  
    function removeParenthesesPair (position) {
      removeToken(position);
      removeToken(openParenthesisStack.pop());
    }
  
    // step through the tokenList
  
    for (i=0; i < l.length; i++) {
      shouldCheckAgain = false;
    
      if ( l[i].tokenType == 'UNKNOWN' ) {
        error.push('found unknown token: '+l[i].tokenValue);
      }
      
      if ( l[i].tokenType == 'OPEN_PAREN' ) openParenthesisStack.push(i);
      if ( l[i].tokenType == 'CLOSE_PAREN' ) removeParenthesesPair(i);
      
      if ( preceedingTokenCanBeMadeChild(i) ) makeChild(i);
      
      if ( preceedingTokenCanBeMadeParent(i) ){
        makeParent(i);
        shouldCheckAgain = true;
      } 
      
      if ( shouldCheckAgain ) i--;
    
    }
  
    // error if tokenList l is not a single token now
    if (l.length == 1) l = l[0];
    else error.push('string did not resolve to a single tree');
  
    // error?
    if (error.length > 0) return {error: error.join(',\n'), tree: l};
    // everything fine - token list is now a tree and can be returned
    else return l;
  
  },
  
  
  // ..........................................................
  // ORDERING
  //
  
  /**
    Takes a string containing an order statement and returns an array
    describing this order for easier processing.
    Called by parse().
    
    @param {String} orderString the string containing the order statement
    @returns {Array} array of order statement
  */
  buildOrder: function (orderString) {
    if (!orderString) {
      return [];
    }
    else {
      var o = orderString.split(',');
      for (var i=0; i < o.length; i++) {
        var p = o[i];
        p = p.replace(/^\s+|\s+$/,'');
        p = p.replace(/\s+/,',');
        p = p.split(',');
        o[i] = {propertyName: p[0]};
        if (p[1] && p[1] == 'DESC') o[i].descending = true;
      }
      
      return o;
    }
    
  }

});


// Class Methods
SC.Query.mixin( /** @scope SC.Query */ {

  /** 
    Constant used for SC.Query#location
  
    @property {String}
  */
  LOCAL: 'local',
  
  /** 
    Constant used for SC.Query#location 
    
    @property {String}
  */
  REMOTE: 'remote',
  
  /**
    Given a query, returns the associated storeKey.  For the inverse of this 
    method see SC.Store.queryFor().
    
    @param {SC.Query} query the query
    @returns {Number} a storeKey.
  */
  storeKeyFor: function(query) {
    return query ? query.get('storeKey') : null;
  },
  
  /**
    Will find which records match a give SC.Query and return an array of 
    store keys. This will also apply the sorting for the query.
    
    @param {SC.Query} query to apply
    @param {SC.RecordArray} records to search within
    @param {SC.Store} store to materialize record from
    @returns {Array} array instance of store keys matching the SC.Query (sorted)
  */
  containsRecords: function(query, records, store) {
    var ret = [];
    for(var idx=0,len=records.get('length');idx<len;idx++) {
      var record = records.objectAt(idx);
      if(record && query.contains(record)) {
        ret.push(record.get('storeKey'));
      }
    }
    
    ret = SC.Query.orderStoreKeys(ret, query, store);
    
    return ret;
  },
  
  /** 
    Sorts a set of store keys according to the orderBy property
    of the SC.Query.
    
    @param {Array} storeKeys to sort
    @param {SC.Query} query to use for sorting
    @param {SC.Store} store to materialize records from
    @returns {Array} sorted store keys.  may be same instance as passed value
  */
  orderStoreKeys: function(storeKeys, query, store) {
    // apply the sort if there is one
    if (storeKeys) {
      
      // Set tmp variable because we can't pass variables to sort function.
      // Do this instead of generating a temporary closure function for perf
      SC.Query._TMP_STORE = store;
      SC.Query._TMP_QUERY_KEY = query;
      storeKeys.sort(SC.Query.compareStoreKeys);
      SC.Query._TMP_STORE = SC.Query._TMP_QUERY_KEY = null;
    }
    
    return storeKeys;
  },
  
  /** 
    Default sort method that is used when calling containsStoreKeys()
    or containsRecords() on this query. Simply materializes two records based 
    on storekeys before passing on to compare() .
 
    @param {Number} storeKey1 a store key
    @param {Number} storeKey2 a store key
    @returns {Number} -1 if record1 < record2,  +1 if record1 > record2, 0 if equal
  */
  compareStoreKeys: function(storeKey1, storeKey2) {
    var store    = SC.Query._TMP_STORE,
        queryKey = SC.Query._TMP_QUERY_KEY,
        record1  = store.materializeRecord(storeKey1),
        record2  = store.materializeRecord(storeKey2);
    return queryKey.compare(record1, record2);
  },
  
  /**
    Returns a SC.Query instance reflecting the passed properties.  Where 
    possible this method will return cached query instances so that multiple 
    calls to this method will return the same instance.  This is not possible 
    however, when you pass custom parameters or set ordering. All returned 
    queries are frozen.
    
    Usually you will not call this method directly.  Instead use the more
    convenient SC.Query.local() and SC.Query.remote().
    
    h2. Examples
    
    There are a number of different ways you can call this method.  
    
    The following return local queries selecting all records of a particular 
    type or types, including any subclasses:
    
    {{{
      var people = SC.Query.local(Ab.Person);
      var peopleAndCompanies = SC.Query.local([Ab.Person, Ab.Company]);
      
      var people = SC.Query.local('Ab.Person');
      var peopleAndCompanies = SC.Query.local('Ab.Person Ab.Company'.w());
      
      var allRecords = SC.Query.local(SC.Record);
    }}} 
    
    The following will match a particular type of condition:
    
    {{{
      var married = SC.Query.local(Ab.Person, "isMarried=YES");
      var married = SC.Query.local(Ab.Person, "isMarried=%@", [YES]);
      var married = SC.Query.local(Ab.Person, "isMarried={married}", {
        married: YES
      });
    }}}
    
    You can also pass a hash of options as the second parameter.  This is 
    how you specify an order, for example:
    
    {{{
      var orderedPeople = SC.Query.local(Ab.Person, { orderBy: "firstName" });
    }}}
    
    @param {String} location the query location.
    @param {SC.Record|Array} recordType the record type or types.
    @param {String} conditions optional conditions
    @param {Hash} params optional params. or pass multiple args.
    @returns {SC.Query}
  */
  build: function(location, recordType, conditions, params) {
    
    var opts = null,
        ret, cache, key, tmp;
    
    // fast case for query objects.
    if (recordType && recordType.isQuery) { 
      if (recordType.get('location') === location) return recordType;
      else return recordType.copy().set('location', location).freeze();
    }
    
    // normalize recordType
    if (typeof recordType === SC.T_STRING) {
      ret = SC.objectForPropertyPath(recordType);
      if (!ret) throw "%@ did not resolve to a class".fmt(recordType);
      recordType = ret ;
    } else if (recordType && recordType.isEnumerable) {
      ret = [];
      recordType.forEach(function(t) {
        if (typeof t === SC.T_STRING) t = SC.objectForPropertyPath(t);
        if (!t) throw "cannot resolve record types: %@".fmt(recordType);
        ret.push(t);
      }, this);
      recordType = ret ;
    } else if (!recordType) recordType = SC.Record; // find all records
    
    if (params === undefined) params = null;
    if (conditions === undefined) conditions = null;

    // normalize other params. if conditions is just a hash, treat as opts
    if (!params && (typeof conditions !== SC.T_STRING)) {
      opts = conditions;
      conditions = null ;
    }
    
    // special case - easy to cache.
    if (!params && !opts) {

      tmp = SC.Query._scq_recordTypeCache;
      if (!tmp) tmp = SC.Query._scq_recordTypeCache = {};
      cache = tmp[location];
      if (!cache) cache = tmp[location] = {}; 
      
      if (recordType.isEnumerable) {
        key = recordType.map(function(k) { return SC.guidFor(k); });
        key = key.sort().join(':');
      } else key = SC.guidFor(recordType);
      
      if (conditions) key = [key, conditions].join('::');
      
      ret = cache[key];
      if (!ret) {
        if (recordType.isEnumerable) {
          opts = { recordTypes: recordType.copy() };
        } else opts = { recordType: recordType };
        
        opts.location = location ;
        opts.conditions = conditions ;
        ret = cache[key] = SC.Query.create(opts).freeze();
      }
    // otherwise parse extra conditions and handle them
    } else {

      if (!opts) opts = {};
      if (!opts.location) opts.location = location ; // allow override

      // pass one or more recordTypes.
      if (recordType && recordType.isEnumerable) {
        opts.recordsTypes = recordType;
      } else opts.recordType = recordType;

      // set conditions and params if needed
      if (conditions) opts.conditions = conditions;
      if (params) opts.parameters = params;

      ret = SC.Query.create(opts).freeze();
    }
    
    return ret ;
  },
  
  /**
    Returns a LOCAL query with the passed options.  For a full description of
    the parameters you can pass to this method, see SC.Query.build().
  
    @param {SC.Record|Array} recordType the record type or types.
    @param {String} conditions optional conditions
    @param {Hash} params optional params. or pass multiple args.
    @returns {SC.Query}
  */
  local: function(recordType, conditions, params) {
    return this.build(SC.Query.LOCAL, recordType, conditions, params);
  },
  
  /**
    Returns a REMOTE query with the passed options.  For a full description of
    the parameters you can pass to this method, see SC.Query.build().
    
    @param {SC.Record|Array} recordType the record type or types.
    @param {String} conditions optional conditions
    @param {Hash} params optional params. or pass multiple args.
    @returns {SC.Query}
  */
  remote: function(recordType, conditions, params) {
    return this.build(SC.Query.REMOTE, recordType, conditions, params);
  },
  
  /** @private 
    called by SC.Record.extend(). invalided expandedRecordTypes
  */
  _scq_didDefineRecordType: function() {
    var q = SC.Query._scq_queriesWithExpandedRecordTypes;
    if (q) {
      q.forEach(function(query) { 
        query.notifyPropertyChange('expandedRecordTypes');
      }, this);
      q.clear();
    }
  }
  
});


/** @private
  Hash of registered comparisons by propery name. 
*/
SC.Query.comparisons = {};

/**
  Call to register a comparison for a specific property name.
  The function you pass should accept two values of this property
  and return -1 if the first is smaller than the second,
  0 if they are equal and 1 if the first is greater than the second.
  
  @param {String} name of the record property
  @param {Function} custom comparison function
  @returns {SC.Query} receiver
*/
SC.Query.registerComparison = function(propertyName, comparison) {
  SC.Query.comparisons[propertyName] = comparison;
};


/**
  Call to register an extension for the query language.
  You shoud provide a name for your extension and a definition
  specifying how it should be parsed and evaluated.
  
  Have a look at queryLanguage for examples of definitions.
  
  TODO add better documentation here
  
  @param {String} tokenName name of the operator
  @param {Object} token extension definition
  @returns {SC.Query} receiver
*/
SC.Query.registerQueryExtension = function(tokenName, token) {
  SC.Query.prototype.queryLanguage[tokenName] = token;
};

// shorthand
SC.Q = SC.Query.from ;


/* >>>>>>>>>> BEGIN source/system/record_array.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

sc_require('models/record');

/**
  @class

  A RecordArray wraps an array of storeKeys and, optionally, a Query object.
  When you access the items of a RecordArray it will automatically convert the
  storeKeys into actual SC.Record objects that the rest of your application
  can work with.
  
  Normally you do not create RecordArray's yourself.  Instead, a RecordArray
  is returned when you call SC.Store.findAll(), already properly configured.
  You can usually just work with the RecordArray instance just like another
  array.
  
  The information below about RecordArray internals is only intended for those
  who need to override this class for some reason to do some special.
  
  h2. Internal Notes
  
  Normally the RecordArray behavior is very simple.  Any array-like operations
  will be translated into similar calls onto the underlying array of 
  storeKeys.  The underlying array can be a real array or it may be a 
  SparseArray, which is how you implement incremental loading.
  
  If the RecordArray is created with an SC.Query objects as well (and it 
  almost always will have a Query object), then the RecordArray will also 
  consult the query for various delegate operations such as determining if 
  the record array should update automatically whenever records in the store
  changes.
  
  It will also ask the Query to refresh the storeKeys whenever records change
  in the store.
  
  @extends SC.Object
  @extends SC.Enumerable
  @extends SC.Array
  @since SproutCore 1.0
*/

SC.RecordArray = SC.Object.extend(SC.Enumerable, SC.Array, 
  /** @scope SC.RecordArray.prototype */ {
    
  /**
    The store that owns this record array.  All record arrays must have a 
    store to function properly. 
    
    NOTE: You MUST set this property on the RecordArray when creating it or 
    else it will fail.
  
    @property {SC.Store}
  */
  store: null,

  /**
    The Query object this record array is based upon.  All record arrays MUST 
    have an associated query in order to function correctly.  You cannot 
    change this property once it has been set.

    NOTE: You MUST set this property on the RecordArray when creating it or 
    else it will fail.
    
    @property {SC.Query}
  */
  query: null,

  /**
    The array of storeKeys as retrieved from the owner store.
    
    @property {SC.Array}
  */
  storeKeys: null,

  /**
    The current status for the record array.  Read from the underlying 
    store.
    
    @property {Number}
  */
  status: SC.Record.EMPTY,
  
  /**
    The current editabile state based on the query.
    
    @property {Boolean}
  */
  isEditable: function() {
    var query = this.get('query');
    return query ? query.get('isEditable') : NO;
  }.property('query').cacheable(),
  
  // ..........................................................
  // ARRAY PRIMITIVES
  // 

  /** @private
    Returned length is a pass-through to the storeKeys array.
  */
  length: function() {
    this.flush(); // cleanup pending changes
    var storeKeys = this.get('storeKeys');
    return storeKeys ? storeKeys.get('length') : 0;
  }.property('storeKeys').cacheable(),

  _scra_records: null,
  
  /** @private
    Looks up the store key in the store keys array and materializes a
    records.
    
    @param {Number} idx index of the object
    @return {SC.Record} materialized record
  */
  objectAt: function(idx) {

    this.flush(); // cleanup pending if needed

    var recs      = this._scra_records, 
        storeKeys = this.get('storeKeys'),
        store     = this.get('store'),
        storeKey, ret ;
    
    if (!storeKeys || !store) return undefined; // nothing to do
    if (recs && (ret=recs[idx])) return ret ; // cached
    
    // not in cache, materialize
    if (!recs) this._scra_records = recs = [] ; // create cache
    storeKey = storeKeys.objectAt(idx);
    
    if (storeKey) {
      // if record is not loaded already, then ask the data source to 
      // retrieve it
      if (store.peekStatus(storeKey) === SC.Record.EMPTY) {
        store.retrieveRecord(null, null, storeKey);
      }
      recs[idx] = ret = store.materializeRecord(storeKey);
    }
    return ret ;
  },

  /** @private - optimized forEach loop. */
  forEach: function(callback, target) {
    this.flush();
    
    var recs      = this._scra_records, 
        storeKeys = this.get('storeKeys'),
        store     = this.get('store'), 
        len       = storeKeys ? storeKeys.get('length') : 0,
        idx, storeKey, rec;
        
    if (!storeKeys || !store) return this; // nothing to do    
    if (!recs) recs = this._scra_records = [] ;
    if (!target) target = this;
    
    for(idx=0;idx<len;idx++) {
      rec = recs[idx];
      if (!rec) {
        rec = recs[idx] = store.materializeRecord(storeKeys.objectAt(idx));
      }
      callback.call(target, rec, idx, this);
    }
    
    return this;
  },
  
  /** @private
    Pass through to the underlying array.  The passed in objects must be
    records, which can be converted to storeKeys.
    
    @param {Number} idx start index
    @param {Number} amt end index
    @param {SC.RecordArray} recs to replace with records
    @return {SC.RecordArray} 'this' after replace
  */
  replace: function(idx, amt, recs) {

    this.flush(); // cleanup pending if needed
    
    var storeKeys = this.get('storeKeys'), 
        len       = recs ? (recs.get ? recs.get('length') : recs.length) : 0,
        i, keys;
        
    if (!storeKeys) throw "storeKeys required";

    var query = this.get('query');
    if (query && !query.get('isEditable')) throw SC.RecordArray.NOT_EDITABLE;
    
    // you can't modify an array whose store keys are autogenerated from a 
    // query.
    
    // map to store keys
    keys = [] ;
    for(i=0;i<len;i++) keys[i] = recs.objectAt(i).get('storeKey');
    
    // pass along - if allowed, this should trigger the content observer 
    storeKeys.replace(idx, amt, keys);
    return this; 
  },
  
  /**
    Returns YES if the passed can be found in the record array.  This is 
    provided for compatibility with SC.Set.
    
    @param {SC.Record} record the record
    @returns {Boolean}
  */
  contains: function(record) {
    return this.indexOf(record)>=0;
  },
  
  /** @private
    Returns the first index where the specified record is found.
    
    @param {SC.Record} record the record
    @param {Number} startAt optional starting index
    @returns {Number} index
  */
  indexOf: function(record, startAt) {
    if (!SC.kindOf(record, SC.Record)) return NO ; // only takes records
    
    this.flush();
    
    var storeKey  = record.get('storeKey'), 
        storeKeys = this.get('storeKeys');
        
    return storeKeys ? storeKeys.indexOf(storeKey, startAt) : -1; 
  },

  /** @private 
    Returns the last index where the specified record is found.
    
    @param {SC.Record} record the record
    @param {Number} startAt optional starting index
    @returns {Number} index
  */
  lastIndexOf: function(record, startAt) {
    if (!SC.kindOf(record, SC.Record)) return NO ; // only takes records

    this.flush();
    
    var storeKey  = record.get('storeKey'), 
        storeKeys = this.get('storeKeys');
    return storeKeys ? storeKeys.lastIndexOf(storeKey, startAt) : -1; 
  },

  /** 
    Adds the specified record to the record array if it is not already part 
    of the array.  Provided for compatibilty with SC.Set.
    
    @param {SC.Record} record
    @returns {SC.RecordArray} receiver
  */
  add: function(record) {
    if (!SC.kindOf(record, SC.Record)) return this ;
    if (this.indexOf(record)<0) this.pushObject(record);
    return this ;
  },
  
  /**
    Removes the specified record from the array if it is not already a part
    of the array.  Provided for compatibility with SC.Set.
    
    @param {SC.Record} record
    @returns {SC.RecordArray} receiver
  */
  remove: function(record) {
    if (!SC.kindOf(record, SC.Record)) return this ;
    this.removeObject(record);
    return this ;
  },
  
  // ..........................................................
  // HELPER METHODS
  // 

  /**
    Extends the standard SC.Enumerable implementation to return results based
    on a Query if you pass it in.
    
    @param {SC.Query} query a SC.Query object
    @returns {SC.RecordArray} 
  */
  find: function(query, target) {
    if (query && query.isQuery) {
      return this.get('store').find(query.queryWithScope(this));
    } else return arguments.callee.base.apply(this,arguments);
  },
  
  /**
    Call whenever you want to refresh the results of this query.  This will
    notify the data source, asking it to refresh the contents.
    
    @returns {SC.RecordArray} receiver
  */
  refresh: function() {
    this.get('store').refreshQuery(this.get('query'));  
  },
  
  /**
    Destroys the record array.  Releases any storeKeys, and deregisters with
    the owner store.
    
    @returns {SC.RecordArray} receiver
  */
  destroy: function() {
    if (!this.get('isDestroyed')) {
      this.get('store').recordArrayWillDestroy(this);
    } 
    
    arguments.callee.base.apply(this,arguments);
  },
  
  // ..........................................................
  // STORE CALLBACKS
  // 
  
  // NOTE: storeWillFetchQuery(), storeDidFetchQuery(), storeDidCancelQuery(),
  // and storeDidErrorQuery() are tested implicitly through the related
  // methods in SC.Store.  We're doing it this way because eventually this 
  // particular implementation is likely to change; moving some or all of this
  // code directly into the store. -CAJ
  
  /** @private
    Called whenever the store initiates a refresh of the query.  Sets the 
    status of the record array to the appropriate status.
    
    @param {SC.Query} query
    @returns {SC.RecordArray} receiver
  */
  storeWillFetchQuery: function(query) {
    var status = this.get('status'),
        K      = SC.Record;
    if ((status === K.EMPTY) || (status === K.ERROR)) status = K.BUSY_LOADING;
    if (status & K.READY) status = K.BUSY_REFRESH;
    this.setIfChanged('status', status);
    return this ;
  },
  
  /** @private
    Called whenever the store has finished fetching a query.
    
    @param {SC.Query} query
    @returns {SC.RecordArray} receiver
  */
  storeDidFetchQuery: function(query) {
    this.setIfChanged('status', SC.Record.READY_CLEAN);
    return this ;
  },
  
  /** @private
    Called whenever the store has cancelled a refresh.  Sets the 
    status of the record array to the appropriate status.
    
    @param {SC.Query} query
    @returns {SC.RecordArray} receiver
  */
  storeDidCancelQuery: function(query) {
    var status = this.get('status'),
        K      = SC.Record;
    if (status === K.BUSY_LOADING) status = K.EMPTY;
    else if (status === K.BUSY_REFRESH) status = K.READY_CLEAN;
    this.setIfChanged('status', status);
    return this ;
  },

  /** @private
    Called whenever the store encounters an error while fetching.  Sets the 
    status of the record array to the appropriate status.
    
    @param {SC.Query} query
    @returns {SC.RecordArray} receiver
  */
  storeDidErrorQuery: function(query) {
    this.setIfChanged('status', SC.Record.ERROR);
    return this ;
  },
  
  /** @private
    Called by the store whenever it changes the state of certain store keys.
    If the receiver cares about these changes, it will mark itself as dirty.
    The next time you try to access the record array it will update any 
    pending changes.
    
    @param {SC.Array} storeKeys the effected store keys
    @param {SC.Set} recordTypes the record types for the storeKeys.
    @returns {SC.RecordArray} receiver
  */
  storeDidChangeStoreKeys: function(storeKeys, recordTypes) {
    var query =  this.get('query');
    // fast path exits
    if (query.get('location') !== SC.Query.LOCAL) return this;
    if (!query.containsRecordTypes(recordTypes)) return this;   
    
    // ok - we're interested.  mark as dirty and save storeKeys.
    var changed = this._scq_changedStoreKeys;
    if (!changed) changed = this._scq_changedStoreKeys = SC.IndexSet.create();
    changed.addEach(storeKeys);
    
    this.set('needsFlush', YES);
    this.enumerableContentDidChange();

    return this;
  },
  
  /**
    Applies the query to any pending changed store keys, updating the record
    array contents as necessary.  This method is called automatically anytime
    you access the RecordArray to make sure it is up to date, but you can 
    call it yourself as well if you need to force the record array to fully
    update immediately.
    
    Currently this method only has an effect if the query location is 
    SC.Query.LOCAL.  You can call this method on any RecordArray however,
    without an error.
    
    @returns {SC.RecordArray} receiver
  */
  flush: function() {
    if (!this.get('needsFlush')) return this; // nothing to do
    this.set('needsFlush', NO); // avoid running again.
    
    // fast exit
    var query = this.get('query'),
        store = this.get('store'); 
    if (!store || !query || query.get('location') !== SC.Query.LOCAL) {
      return this;
    }
    
    // OK, actually generate some results
    var storeKeys = this.get('storeKeys'),
        changed   = this._scq_changedStoreKeys,
        didChange = NO,
        K         = SC.Record,
        rec, status, recordType, sourceKeys, scope, included;

    // if we have storeKeys already, just look at the changed keys
    if (storeKeys) {
      if (changed) {
        changed.forEach(function(storeKey) {
          // get record - do not include EMPTY or DESTROYED records
          status = store.peekStatus(storeKey);
          if (!(status & K.EMPTY) && !((status & K.DESTROYED) || (status === K.BUSY_DESTROYING))) {
            rec = store.materializeRecord(storeKey);
            included = !!(rec && query.contains(rec));
          } else included = NO ;
          
          // if storeKey should be in set but isn't -- add it.
          if (included) {
            if (storeKeys.indexOf(storeKey)<0) {
              if (!didChange) storeKeys = storeKeys.copy(); 
              storeKeys.pushObject(storeKey); 
            }
          // if storeKey should NOT be in set but IS -- remove it
          } else {
            if (storeKeys.indexOf(storeKey)>=0) {
              if (!didChange) storeKeys = storeKeys.copy();
              storeKeys.removeObject(storeKey);
            } // if (storeKeys.indexOf)
          } // if (included)
        }, this);
        // make sure resort happens
        didChange = YES ;
      } // if (changed)
    
    // if no storeKeys, then we have to go through all of the storeKeys 
    // and decide if they belong or not.  ick.
    } else {
      
      // collect the base set of keys.  if query has a parent scope, use that
      if (scope = query.get('scope')) {
        sourceKeys = scope.flush().get('storeKeys');

      // otherwise, lookup all storeKeys for the named recordType...
      } else if (recordType = query.get('expandedRecordTypes')) {
        sourceKeys = SC.IndexSet.create();
        recordType.forEach(function(cur) { 
          sourceKeys.addEach(store.storeKeysFor(recordType));
        });
      }

      // loop through storeKeys to determine if it belongs in this query or 
      // not.
      storeKeys = [];
      sourceKeys.forEach(function(storeKey) {
        status = store.peekStatus(storeKey);
        if (!(status & K.EMPTY) && !((status & K.DESTROYED) || (status === K.BUSY_DESTROYING))) {
          rec = store.materializeRecord(storeKey);
          if (rec && query.contains(rec)) storeKeys.push(storeKey);
        }
      });
      
      didChange = YES ;
    }

    // clear set of changed store keys
    if (changed) changed.clear();
    
    // only resort and update if we did change
    if (didChange) {
      storeKeys = SC.Query.orderStoreKeys(storeKeys, query, store);
      this.set('storeKeys', SC.clone(storeKeys)); // replace content
    }

    return this;
  },

  /**
    Set to YES when the query is dirty and needs to update its storeKeys 
    before returning any results.  RecordArrays always start dirty and become
    clean the first time you try to access their contents.
    
    @property {Boolean}
  */
  needsFlush: YES,

  // ..........................................................
  // EMULATE SC.ERROR API
  // 
  
  /**
    Returns YES whenever the status is SC.Record.ERROR.  This will allow you 
    to put the UI into an error state.
    
    @property {Boolean}
  */
  isError: function() {
    return this.get('status') & SC.Record.ERROR;
  }.property('status').cacheable(),

  /**
    Returns the receiver if the record array is in an error state.  Returns null
    otherwise.
    
    @property {SC.Record}
  */
  errorValue: function() {
    return this.get('isError') ? SC.val(this.get('errorObject')) : null ;
  }.property('isError').cacheable(),
  
  /**
    Returns the current error object only if the record array is in an error state.
    If no explicit error object has been set, returns SC.Record.GENERIC_ERROR.
    
    @property {SC.Error}
  */
  errorObject: function() {
    if (this.get('isError')) {
      var store = this.get('store');
      return store.readQueryError(this.get('query')) || SC.Record.GENERIC_ERROR;
    } else return null ;
  }.property('isError').cacheable(),
  
  // ..........................................................
  // INTERNAL SUPPORT
  // 
  
  /** @private 
    Invoked whenever the storeKeys array changes.  Observes changes.
  */
  _storeKeysDidChange: function() {
    var storeKeys = this.get('storeKeys');
    
    var prev = this._prevStoreKeys, 
        f    = this._storeKeysContentDidChange,
        fs   = this._storeKeysStateDidChange;
    
    if (storeKeys === prev) return this; // nothing to do
    
    if (prev) prev.removeObserver('[]', this, f);
    this._prevStoreKeys = storeKeys;
    if (storeKeys) storeKeys.addObserver('[]', this, f);
    
    var rev = (storeKeys) ? storeKeys.propertyRevision : -1 ;
    this._storeKeysContentDidChange(storeKeys, '[]', storeKeys, rev);
    
  }.observes('storeKeys'),
  
  /** @private
    Invoked whenever the content of the storeKeys array changes.  This will
    dump any cached record lookup and then notify that the enumerable content
    has changed.
  */
  _storeKeysContentDidChange: function(target, key, value, rev) {
    if (this._scra_records) this._scra_records.length=0 ; // clear cache
    
    this.beginPropertyChanges()
      .notifyPropertyChange('length')
      .enumerableContentDidChange()
    .endPropertyChanges();
  },
  
  /** @private */
  init: function() {
    arguments.callee.base.apply(this,arguments);
    this._storeKeysDidChange();
  }
  
});

SC.RecordArray.mixin({  
  
  /** 
    Standard error throw when you try to modify a record that is not editable
    
    @property {SC.Error}
  */
  NOT_EDITABLE: SC.Error.desc("SC.RecordArray is not editable")
});
// DATASTORE.JS END

// CONTROLLER.JS BEGIN
SC.Controller = SC.Object.extend(
/** @scope SC.Controller.prototype */ {
  
  /**
    Makes a controller editable or not editable.  The SC.Controller class 
    itself does not do anything with this property but subclasses will 
    respect it when modifying content.
    
    @property {Boolean}
  */
  isEditable: YES
  
});
// CONTROLLER.JS END

// OBJECT.JS BEGIN
/** @class

  An ObjectController gives you a simple way to manage the editing state of
  an object.  You can use an ObjectController instance as a "proxy" for your
  model objects.
  
  Any properties you get or set on the object controller, will be passed 
  through to its content object.  This allows you to setup bindings to your
  object controller one time for all of your views and then swap out the 
  content as needed.
  
  h2. Working with Arrays
  
  An ObjectController can accept both arrays and single objects as content.  
  If the content is an array, the ObjectController will do its best to treat 
  the array as a single object.  For example, if you set the content of an
  ObjectController to an array of Contact records and then call:
  
    contactController.get('name');
    
  The controller will check the name property of each Contact in the array.  
  If the value of the property for each Contact is the same, that value will 
  be returned.  If the any values are different, then an array will be 
  returned with the values from each Contact in them. 
  
  Most SproutCore views can work with both arrays and single content, which 
  means that most of the time, you can simply hook up your views and this will
  work.
  
  If you would prefer to make sure that your ObjectController is always 
  working with a single object and you are using bindings, you can always 
  setup your bindings so that they will convert the content to a single object 
  like so:
  
    contentBinding: SC.Binding.Single('MyApp.listController.selection') ;

  This will ensure that your content property is always a single object 
  instead of an array.
  
  @extends SC.Controller
  @since SproutCore 1.0
*/
SC.ObjectController = SC.Controller.extend(
/** @scope SC.ObjectController.prototype */ {

  // ..........................................................
  // PROPERTIES
  // 
  
  /**
    Set to the object you want this controller to manage.  The object should
    usually be a single value; not an array or enumerable.  If you do supply
    an array or enumerable with a single item in it, the ObjectController
    will manage that single item.

    Usually your content object should implement the SC.Observable mixin, but
    this is not required.  All SC.Object-based objects support SC.Observable
    
    @property {Object}
  */
  content: null,

  /**
    If YES, then setting the content to an enumerable or an array with more 
    than one item will cause the Controller to attempt to treat the array as
    a single object.  Use of get(), for example, will get every property on
    the enumerable and return it.  set() will set the property on every item
    in the enumerable. 
    
    If NO, then setting content to an enumerable with multiple items will be
    treated like setting a null value.  hasContent will be NO.
    
    @property {Boolean}
  */
  allowsMultipleContent: NO,

  /**
    Becomes YES whenever this object is managing content.  Usually this means
    the content property contains a single object or an array or enumerable
    with a single item.  Array's or enumerables with multiple items will 
    normally make this property NO unless allowsMultipleContent is YES.
    
    @property {Boolean}
  */
  hasContent: function() {
    return !SC.none(this.get('observableContent'));
  }.property('observableContent'),
  
  /**
    Makes a controller editable or not editable.  The SC.Controller class 
    itself does not do anything with this property but subclasses will 
    respect it when modifying content.
    
    @property {Boolean}
  */
  isEditable: YES,
  
  /**
    Primarily for internal use.  Normally you should not access this property 
    directly.  
    
    Returns the actual observable object proxied by this controller.  Usually 
    this property will mirror the content property.  In some cases - notably 
    when setting content to an enumerable, this may return a different object.
    
    Note that if you set the content to an enumerable which itself contains
    enumerables and allowsMultipleContent is NO, this will become null.
    
    @property {Object}
  */
  observableContent: function() {
    var content = this.get('content'),
        len, allowsMultiple;
        
    // if enumerable, extract the first item or possibly become null
    if (content && content.isEnumerable) {
      len = content.get('length');
      allowsMultiple = this.get('allowsMultipleContent');
      
      if (len === 1) content = content.firstObject();
      else if (len===0 || !allowsMultiple) content = null;
      
      // if we got some new content, it better not be enum also...
      if (content && !allowsMultiple && content.isEnumerable) content=null;
    }
    
    return content;
  }.property('content', 'allowsMultipleContent').cacheable(),

  // ..........................................................
  // METHODS
  // 

  /**
    Override this method to destroy the selected object.
    
    The default just passes this call onto the content object if it supports
    it, and then sets the content to null.  
    
    Unlike most calls to destroy() this will not actually destroy the 
    controller itself; only the the content.  You continue to use the 
    controller by setting the content to a new value.
    
    @returns {SC.ObjectController} receiver
  */
  destroy: function() {
    var content = this.get('observableContent') ;
    if (content && SC.typeOf(content.destroy) === SC.T_FUNCTION) {
      content.destroy();
    } 
    this.set('content', null) ;  
    return this;
  },
  
  /**
    Invoked whenever any property on the content object changes.  

    The default implementation will simply notify any observers that the 
    property has changed.  You can override this method if you need to do 
    some custom work when the content property changes.
    
    If you have set the content property to an enumerable with multiple 
    objects and you set allowsMultipleContent to YES, this method will be 
    called anytime any property in the set changes.

    If all properties have changed on the content or if the content itself 
    has changed, this method will be called with a key of "*".
    
    @param {Object} target the content object
    @param {String} key the property that changes
    @returns {void}
  */
  contentPropertyDidChange: function(target, key) {
    if (key === '*') this.allPropertiesDidChange();
    else this.notifyPropertyChange(key);
  },
  
  /**
    Called whenver you try to get/set an unknown property.  The default 
    implementation will pass through to the underlying content object but 
    you can override this method to do some other kind of processing if 
    needed.
    
    @property {String} key key being retrieved
    @property {Object} value value to set or undefined if reading only
    @returns {Object} property value
  */
  unknownProperty: function(key,value) {
    
    // avoid circular references
    if (key==='content') {
      if (value !== undefined) this.content = value;
      return this.content;
    }
    
    // for all other keys, just pass through to the observable object if 
    // there is one.  Use getEach() and setEach() on enumerable objects.
    var content = this.get('observableContent'), loc, cur, isSame;
    if (content===null || content===undefined) return undefined; // empty

    // getter...
    if (value === undefined) {
      if (content.isEnumerable) {
        value = content.getEach(key);

        // iterate over array to see if all values are the same. if so, then
        // just return that value
        loc = value.get('length');
        if (loc>0) {
          isSame = YES;
          cur = value.objectAt(0);
          while((--loc > 0) && isSame) {
            if (cur !== value.objectAt(loc)) isSame = NO ;
          }
          if (isSame) value = cur;
        } else value = undefined; // empty array.

      } else value = (content.isObservable) ? content.get(key) : content[key];
      
    // setter
    } else {
      if (!this.get('isEditable')) {
        throw "%@.%@ is not editable".fmt(this,key);
      }
      
      if (content.isEnumerable) content.setEach(key, value);
      else if (content.isObservable) content.set(key, value);
      else content[key] = value;
    }
    
    return value;
  },
  
  // ...............................
  // INTERNAL SUPPORT
  //

  /** @private - setup observer on init if needed. */
  init: function() {
    arguments.callee.base.apply(this, arguments);
    if (this.get('observableContent')) this._scoc_contentDidChange();
  },

  /**  @private
    
    Called whenever the observable content property changes.  This will setup
    observers on the content if needed.
  */
  _scoc_contentDidChange: function() {
    var last = this._scoc_observableContent,
        cur  = this.get('observableContent'),
        func = this.contentPropertyDidChange,
        efunc= this._scoc_enumerableContentDidChange;

    if (last === cur) return this; // nothing to do
    
    this._scoc_observableContent = cur; // save old content
    
    // stop observing last item -- if enumerable stop observing set
    if (last) {
      if (last.isEnumerable) last.removeObserver('[]', this, efunc);
      else if (last.isObservable) last.removeObserver('*', this, func);
    }
    
    if (cur) {
      if (cur.isEnumerable) cur.addObserver('[]', this, efunc);
      else if (cur.isObservable) cur.addObserver('*', this, func);
    }

    // notify!
    if ((last && last.isEnumerable) || (cur && cur.isEnumerable)) {
      this._scoc_enumerableContentDidChange();
    } else this.contentPropertyDidChange(cur, '*');

  }.observes("observableContent"),
  
  /** @private
    Called when observed enumerable content has changed.  This will teardown
    and setup observers on the enumerable content items and then calls 
    contentPropertyDidChange().  This method may be called even if the new
    'cur' is not enumerable but the last content was enumerable.
  */
  _scoc_enumerableContentDidChange: function() {
    var cur  = this.get('observableContent'),
        set  = this._scoc_observableContentItems,
        func = this.contentPropertyDidChange;
    
    // stop observing each old item
    if (set) {
      set.forEach(function(item) {
        if (item.isObservable) item.removeObserver('*', this, func);
      }, this);
      set.clear();
    }
    
    // start observing new items if needed
    if (cur && cur.isEnumerable) {
      if (!set) set = SC.Set.create();
      cur.forEach(function(item) {
        if (set.contains(item)) return ; // nothing to do
        set.add(item);
        if (item.isObservable) item.addObserver('*', this, func);
      }, this); 
    } else set = null;
    
    this._scoc_observableContentItems = set; // save for later cleanup
  
    // notify
    this.contentPropertyDidChange(cur, '*');
    return this ;
  }
        
}) ;

// OBJECT.JS END


// SELECTIONSUPPORT.JS BEGIN
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/**
  @namespace
  
  Implements common selection management properties for controllers.
  
  Selection can be managed by any controller in your applications.  This
  mixin provides some common management features you might want such as
  disabling selection, or restricting empty or multiple selections.
  
  To use this mixin, simply add it to any controller you want to manage 
  selection and call updateSelectionAfterContentChange()
  whenever your source content changes.  You can also override the properties
  defined below to configure how the selection management will treat your 
  content.
  
  This mixin assumes the arrangedObjects property will return an SC.Array of 
  content you want the selection to reflect.
  
  Add this mixin to any controller you want to manage selection.  It is 
  already applied to the CollectionController and ArrayController.
  
  @since SproutCore 1.0
*/
SC.SelectionSupport = {
  
  // ..........................................................
  // PROPERTIES
  // 
  
  /**
    Walk like a duck.
    
    @property {Boolean}
  */
  hasSelectionSupport: YES,
  
  /**
    If YES, selection is allowed. Default is YES.
    
    @property {Boolean}
  */
  allowsSelection: YES,
  
  /**
    If YES, multiple selection is allowed. Default is YES.
    
    @property {Boolean}
  */
  allowsMultipleSelection: YES,
  
  /**
    If YES, allow empty selection Default is YES.
    
    @property {Boolean}
  */
  allowsEmptySelection: YES,
  
  /**
    Override to return the first selectable object.  For example, if you 
    have groups or want to otherwise limit the kinds of objects that can be
    selected.
    
    the default imeplementation returns firstObject property.
    
    @returns {Object} first selectable object
  */
  firstSelectableObject: function() {
    return this.get('firstObject');
  }.property(),
  
  /**
    This is the current selection.  You can make this selection and another
    controller's selection work in concert by binding them together. You
    generally have a master selection that relays changes TO all the others.
    
    @property {SC.SelectionSet}
  */
  selection: function(key, value) {
        
    var old = this._scsel_selection,
        oldlen = old ? old.get('length') : 0,
        content, empty, len;

    // whenever we have to recompute selection, reapply all the conditions to
    // the selection.  This ensures that changing the conditions immediately
    // updates the selection.
    // 
    // Note also if we don't allowSelection, we don't clear the old selection;
    // we just don't allow it to be changed.
    if ((value === undefined) || !this.get('allowsSelection')) value = old ;

    len = (value && value.isEnumerable) ? value.get('length') : 0;
    
    // if we don't allow multiple selection
    if ((len>1) && !this.get('allowsMultipleSelection')) {

      if (oldlen>1) {
        value = SC.SelectionSet.create()
                  .addObject(old.get('firstObject')).freeze();
        len   = 1;
      } else {
        value = old;
        len = oldlen;
      }
    }
    
    // if we don't allow empty selection, block that also.  select first 
    // selectable item if necessary.
    if ((len===0) && !this.get('allowsEmptySelection')) {
      if (oldlen===0) {
        value = this.get('firstSelectableObject');
        if (value) value = SC.SelectionSet.create().addObject(value).freeze();
        else value = SC.SelectionSet.EMPTY;
        len = value.get('length');
        
      } else {
        value = old;
        len = oldlen;
      }
    }
    
    // if value is empty or is not enumerable, then use empty set
    if (len===0) value = SC.SelectionSet.EMPTY;
    
    // always use a frozen copy...
    value = value.frozenCopy();
    this._scsel_selection = value;
    
    return value;
    
  }.property('arrangedObjects', 'allowsEmptySelection', 
      'allowsMultipleSelection', 'allowsSelection').cacheable(),
  
  /**
    YES if the receiver currently has a non-zero selection.
    
    @property {Boolean}
  */
  hasSelection: function() {
    var sel = this.get('selection') ;
    return !!sel && (sel.get('length') > 0) ;
  }.property('selection').cacheable(),
  
  // ..........................................................
  // METHODS
  // 

  /**
    Selects the passed objects in your content.  If you set "extend" to YES,
    then this will attempt to extend your selection as well.
  
    @param {SC.Enumerable} objects objects to select
    @param {Boolean} extend optionally set to YES to extend selection
    @returns {Object} receiver
  */
  selectObjects: function(objects, extend) {

    // handle passing an empty array
    if (!objects || objects.get('length')===0) {
      if (!extend) this.set('selection', SC.SelectionSet.EMPTY);
      return this;
    }
    
    var sel = this.get('selection');
    if (extend && sel) sel = sel.copy();
    else sel = SC.SelectionSet.create();
    
    sel.addObjects(objects).freeze();
    this.set('selection', sel);
    return this ;
  },
  
  /**
    Selects a single passed object in your content.  If you set "extend" to 
    YES then this will attempt to extend your selection as well.
    
    @param {Object} object object to select
    @param {Boolean} extend optionally set to YES to extend selection
    @returns {Object} receiver
  */
  selectObject: function(object, extend) {
    if (object === null) {
      if (!extend) this.set('selection', null);
      return this ;
      
    } else return this.selectObjects([object], extend);
  },    

  /**
    Deselects the passed objects in your content.
    
    @param {SC.Enumerable} objects objects to select
    @returns {Object} receiver
  */
  deselectObjects: function(objects) {

    if (!objects || objects.get('length')===0) return this; // nothing to do
    
    var sel = this.get('selection');
    if (!sel || sel.get('length')===0) return this; // nothing to do

    // find index for each and remove it
    sel = sel.copy().removeObjects(objects).freeze();
    this.set('selection', sel.freeze());
    return this ;
  },
  
  /**
    Deselects the passed object in your content.
    
    @param {SC.Object} object single object to select
    @returns {Object} receiver
  */
  deselectObject: function(object) {
    if (!object) return this; // nothing to do
    else return this.deselectObjects([object]);
  },
  
  /**  @private
    Call this method whenever your source content changes to ensure the 
    selection always remains up-to-date and valid.
  */
  updateSelectionAfterContentChange: function() {
    
    var content = this.get('arrangedObjects'),
        sel     = this.get('selection'),
        ret     = sel,
        indexes, len, max;

    // first, make sure selection goes beyond current items...
    if (ret && content && ret.get('sources').indexOf(content)>=0) {
      indexes = ret.indexSetForSource(content);
      len     = content.get('length') ;
      max     = indexes ? indexes.get('max') : 0;
      
      // to clean this up, just copy the selection and remove the extra 
      // indexes
      if (max > len) {
        ret = ret.copy().remove(content, len, max-len).freeze();
        this.set('selection', ret);
      }
    }

    // if we didn't have to recompute the selection anyway, do a quick check
    // to make sure there are no constraints that need to be recomputed.
    if (ret === sel) {
      len = sel ? sel.get('length') : 0;
      max = content ? content.get('length') : 0;
      
      // need to recompute if the selection is empty and it shouldn't be but
      // only if we have some content; otherwise what's the point?
      if ((len===0) && !this.get('allowsEmptySelection') && max>0) {
        this.notifyPropertyChange('selection');
      }
    }

    return this ;
  }
    
};

// SELECTIONSUPPORT.JS END



// ARRAY.JS BEGIN
/**
  @class

  An ArrayController provides a way for you to publish an array of objects
  for CollectionView or other controllers to work with.  To work with an 
  ArrayController, set the content property to the array you want the 
  controller to manage.  Then work directly with the controller object as if
  it were the array itself.
  
  When you want to display an array of objects in a CollectionView, bind the
  "arrangedObjects" of the array controller to the CollectionView's "content"
  property.  This will automatically display the array in the collection view.

  @extends SC.Controller
  @extends SC.Array
  @extends SC.SelectionSupport
  @author Charles Jolley
  @since SproutCore 1.0
*/
SC.ArrayController = SC.Controller.extend(SC.Array, SC.SelectionSupport,
/** @scope SC.ArrayController.prototype */ {

  // ..........................................................
  // PROPERTIES
  // 
  
  /**
    The content array managed by this controller.  
    
    You can set the content of the ArrayController to any object that 
    implements SC.Array or SC.Enumerable.  If you set the content to an object
    that implements SC.Enumerable only, you must also set the orderBy property
    so that the ArrayController can order the enumerable for you.
    
    If you set the content to a non-enumerable and non-array object, then the
    ArrayController will wrap the item in an array in an attempt to normalize
    the result.
    
    @property {SC.Array}
  */
  content: null,

  /**
    Makes the array editable or not.  If this is set to NO, then any attempts
    at changing the array content itself will throw an exception.
    
    @property {Boolean}
  */
  isEditable: YES,
  
  /**
    Used to sort the array.
    
    If you set this property to a key name, array of key names, or a function,
    then then ArrayController will automatically reorder your content array
    to match the sort order.  (If you set a function, the function will be
    used to sort).

    Normally, you should only use this property if you set the content of the
    controller to an unordered enumerable such as SC.Set or SC.SelectionSet.
    In this case the orderBy property is required in order for the controller
    to property order the content for display.
    
    If you set the content to an array, it is usually best to maintain the 
    array in the proper order that you want to display things rather than 
    using this method to order the array since it requires an extra processing
    step.  You can use this orderBy property, however, for displaying smaller 
    arrays of content.
    
    Note that you can only to use addObject() to insert new objects into an
    array that is ordered.  You cannot manually reorder or insert new objects
    into specific locations because the order is managed by this property 
    instead.
    
    If you pass a function, it should be suitable for use in compare().
    
    @property {String|Array|Function}
  */
  orderBy: null,
    
  /**
    Set to YES if you want the controller to wrap non-enumerable content    
    in an array and publish it.  Otherwise, it will treat single content like 
    null content.
    
    @property {Boolean}
  */
  allowsSingleContent: YES,
  
  /**
    Set to YES if you want objects removed from the array to also be
    deleted.  This is a convenient way to manage lists of items owned
    by a parent record object.
    
    Note that even if this is set to NO, calling destroyObject() instead of
    removeObject() will still destroy the object in question as well as 
    removing it from the parent array.
    
    @property {Boolean}
  */
  destroyOnRemoval: NO,

  /**
    Returns an SC.Array object suitable for use in a CollectionView.  
    Depending on how you have your ArrayController configured, this property
    may be one of several different values.  
    
    @property {SC.Array}
  */
  arrangedObjects: function() {
    return this;
  }.property().cacheable(),
  
  /**
    Computed property indicates whether or not the array controller can 
    remove content.  You can delete content only if the content is not single
    content and isEditable is YES.
    
    @property {Boolean}
  */
  canRemoveContent: function() {
    var content = this.get('content'), ret;
    ret = !!content && this.get('isEditable') && this.get('hasContent');
    if (ret) {
      return !content.isEnumerable || 
             (SC.typeOf(content.removeObject) === SC.T_FUNCTION);
    } else return NO ;
  }.property('content', 'isEditable', 'hasContent'),
  
  /**
    Computed property indicates whether you can reorder content.  You can
    reorder content as long a the controller isEditable and the content is a
    real SC.Array-like object.  You cannot reorder content when orderBy is
    non-null.
    
    @property {Boolean}
  */
  canReorderContent: function() {
    var content = this.get('content'), ret;
    ret = !!content && this.get('isEditable') && !this.get('orderBy');
    return ret && !!content.isSCArray;
  }.property('content', 'isEditable', 'orderBy'),
  
  /**
    Computed property insides whether you can add content.  You can add 
    content as long as the controller isEditable and the content is not a 
    single object.
    
    Note that the only way to simply add object to an ArrayController is to
    use the addObject() or pushObject() methods.  All other methods imply 
    reordering and will fail.
    
    @property {Boolean}
  */
  canAddContent: function() {
    var content = this.get('content'), ret ;
    ret = content && this.get('isEditable') && content.isEnumerable;
    if (ret) {
      return (SC.typeOf(content.addObject) === SC.T_FUNCTION) || 
             (SC.typeOf(content.pushObject) === SC.T_FUNCTION); 
    } else return NO ;
  }.property('content', 'isEditable'),
  
  /**
    Set to YES if the controller has valid content that can be displayed,
    even an empty array.  Returns NO if the content is null or not enumerable
    and allowsSingleContent is NO.
    
    @property {Boolean}
  */
  hasContent: function() {
    var content = this.get('content');
    return !!content && 
           (!!content.isEnumerable || !!this.get('allowsSingleContent'));
  }.property('content', 'allowSingleContent'),

  /**
    Returns the current status property for the content.  If the content does
    not have a status property, returns SC.Record.READY.
    
    @property {Number}
  */
  status: function() {
    var content = this.get('content'),
        ret = content ? content.get('status') : null;
    return ret ? ret : SC.Record.READY;
  }.property().cacheable(),
  
  // ..........................................................
  // METHODS
  // 
  
  /**
    Adds an object to the array.  If the content is ordered, this will add the 
    object to the end of the content array.  The content is not ordered, the
    location depends on the implementation of the content.
    
    If the source content does not support adding an object, then this method 
    will throw an exception.
    
    @param {Object} object the object to add
    @returns {SC.ArrayController} receiver
  */
  addObject: function(object) {
    if (!this.get('canAddContent')) throw "%@ cannot add content".fmt(this);
    
    var content = this.get('content');
    if (content.isSCArray) content.pushObject(object);
    else if (content.addObject) content.addObject(object);
    else throw "%@.content does not support addObject".fmt(this);
    
    return this;
  },
  
  /**
    Removes the passed object from the array.  If the underyling content 
    is a single object, then this simply sets the content to null.  Otherwise
    it will call removeObject() on the content.
    
    Also, if destroyOnRemoval is YES, this will actually destroy the object.
    
    @param {Object} object the object to remove
    @returns {SC.ArrayController} receiver
  */
  removeObject: function(object) {
    if (!this.get('canRemoveContent')) {
      throw "%@ cannot remove content".fmt(this);
    }
    
    var content = this.get('content');
    if (content.isEnumerable) content.removeObject(object);
    else {
      this.set('content', null);
    }
    
    if (this.get('destroyOnRemoval') && object.destroy) object.destroy();
    return this; 
  },
  
  // ..........................................................
  // SC.ARRAY SUPPORT
  // 

  /**
    Compute the length of the array based on the observable content
    
    @property {Number}
  */
  length: function() {
    var content = this._scac_observableContent();
    return content ? content.get('length') : 0;
  }.property().cacheable(),

  /** @private
    Returns the object at the specified index based on the observable content
  */
  objectAt: function(idx) {
    var content = this._scac_observableContent();
    return content ? content.objectAt(idx) : undefined ;    
  },
  
  /** @private
    Forwards a replace on to the content, but only if reordering is allowed.
  */
  replace: function(start, amt, objects) {
    // check for various conditions before a replace is allowed
    if (!objects || objects.get('length')===0) {
      if (!this.get('canRemoveContent')) {
        throw "%@ cannot remove objects from the current content".fmt(this);
      }
    } else if (!this.get('canReorderContent')) {
      throw "%@ cannot add or reorder the current content".fmt(this);
    }    
    
    // if we can do this, then just forward the change.  This should fire
    // updates back up the stack, updating rangeObservers, etc.
    var content = this.get('content'); // note: use content, not observable
    var objsToDestroy = [], i, objsLen;
    if (this.get('destroyOnRemoval')){
      for(i=0; i<amt; i++){
        objsToDestroy.push(content.objectAt(i+start));
      }
    }
    
    if (content) content.replace(start, amt, objects);
    for(i=0, objsLen = objsToDestroy.length; i<objsLen; i++){
      
      objsToDestroy[i].destroy();
    }
    objsToDestroy = null;
    
    return this; 
  },

  indexOf: function(object, startAt) {
    var content = this._scac_observableContent();
    return content ? content.indexOf(object, startAt) : -1;
  },

  // ..........................................................
  // INTERNAL SUPPORT
  // 
  
  /** @private */
  init: function() {
    arguments.callee.base.apply(this, arguments);
    this._scac_contentDidChange();
  },
  
  /** @private
    Cached observable content property.  Set to NO to indicate cache is 
    invalid.
  */
  _scac_cached: NO,
  
  /**
    @private
    
    Returns the current array this controller is actually managing.  Usually
    this should be the same as the content property, but sometimes we need to
    generate something different because the content is not a regular array.
    
    Passing YES to the force parameter will force this value to be recomputed.
  
    @returns {SC.Array} observable or null
  */
  _scac_observableContent: function() {
    var ret = this._scac_cached;
    if (ret !== NO) return ret;
    
    var content = this.get('content'),
        orderBy, func, t, len;
    
    // empty content
    if (SC.none(content)) return this._scac_cached = [];

    // wrap non-enumerables
    if (!content.isEnumerable) {
      ret = this.get('allowsSingleContent') ? [content] : [];
      return (this._scac_cached = ret);
    } 
    
    // no-wrap
    orderBy = this.get('orderBy');
    if (!orderBy) {
      if (content.isSCArray) return (this._scac_cached = content) ;
      else throw "%@.orderBy is required for unordered content".fmt(this);     
    }
    
    // all remaining enumerables must be sorted.
    
    // build array - then sort it
    switch(SC.typeOf(orderBy)) {
    case SC.T_STRING:
      orderBy = [orderBy];
      break;
    case SC.T_FUNCTION:
      func = orderBy ;
      break;
    case SC.T_ARRAY:
      break;
    default:
      throw "%@.orderBy must be Array, String, or Function".fmt(this);
    }
        
    // generate comparison function if needed - use orderBy
    if (!func) {  
      len = orderBy.get('length');
      func = function(a,b) {
        var idx=0, status=0, key, aValue, bValue;
        for(idx=0;(idx<len)&&(status===0);idx++) {
          key = orderBy.objectAt(idx);
        
          if (!a) aValue = a ;
          else if (a.isObservable) aValue = a.get(key);
          else aValue = a[key];

          if (!b) bValue = b ;
          else if (b.isObservable) bValue = b.get(key);
          else bValue = b[key];
        
          status = SC.compare(aValue, bValue);
        }
        return status ; 
      };
    }

    ret = [];
    content.forEach(function(o) { ret.push(o); });
    ret.sort(func);
    
    func = null ; // avoid memory leaks
    return (this._scac_cached = ret) ;
  },
  
  /** @private
    Whenever content changes, setup and teardown observers on the content
    as needed.
  */
  _scac_contentDidChange: function() {

    this._scac_cached = NO; // invalidate observable content
    
    var cur    = this.get('content'),
        orders = !!this.get('orderBy'),
        last   = this._scac_content,
        oldlen = this._scac_length || 0,
        ro     = this._scac_rangeObserver,
        func   = this._scac_rangeDidChange,
        efunc  = this._scac_enumerableDidChange,
        sfunc  = this._scac_contentStatusDidChange,
        newlen;
        
    if (last === cur) return this; // nothing to do

    // teardown old observer
    if (last) {
      if (ro && last.isSCArray) last.removeRangeObserver(ro);
      else if (last.isEnumerable) last.removeObserver('[]', this, efunc);
      last.removeObserver('status', this, sfunc);
    }
    
    ro = null;
    
    // save new cached values 
    this._scac_cached = NO;
    this._scac_content = cur ;
    
    // setup new observers
    // also, calculate new length.  do it manually instead of using 
    // get(length) because we want to avoid computed an ordered array.
    if (cur) {
      if (!orders && cur.isSCArray) ro = cur.addRangeObserver(null,this,func);
      else if (cur.isEnumerable) cur.addObserver('[]', this, efunc);
      newlen = cur.isEnumerable ? cur.get('length') : 1; 
      cur.addObserver('status', this, sfunc);
      
    } else newlen = SC.none(cur) ? 0 : 1;

    this._scac_rangeObserver = ro;
    

    // finally, notify enumerable content has changed.
    this._scac_length = newlen;
    this._scac_contentStatusDidChange();
    this.enumerableContentDidChange(0, newlen, newlen - oldlen);
    this.updateSelectionAfterContentChange();
  }.observes('content'),
  
  /** @private
    Whenever enumerable content changes, need to regenerate the 
    observableContent and notify that the range has changed.  
    
    This is called whenever the content enumerable changes or whenever orderBy
    changes.
  */
  _scac_enumerableDidChange: function() {
    var content = this.get('content'), // use content directly
        newlen  = content ? content.get('length') : 0,
        oldlen  = this._scac_length;
        
    this._scac_length = newlen;
    this.beginPropertyChanges();
    this._scac_cached = NO; // invalidate
    this.enumerableContentDidChange(0, newlen, newlen-oldlen);
    this.endPropertyChanges();
    this.updateSelectionAfterContentChange();
  }.observes('orderBy'),
  
  /** @private
    Whenever array content changes, need to simply forward notification.
    
    Assumes that content is not null and is SC.Array.
  */
  _scac_rangeDidChange: function(array, objects, key, indexes) {
    if (key !== '[]') return ; // nothing to do
    
    var content = this.get('content');
    this._scac_length = content.get('length');
    this._scac_cached = NO; // invalidate
    
    // if array length has changed, just notify every index from min up
    if (indexes) {
      this.beginPropertyChanges();
      indexes.forEachRange(function(start, length) {
        this.enumerableContentDidChange(start, length, 0);
      }, this);
      this.endPropertyChanges();
      this.updateSelectionAfterContentChange();
    }
  },
  
  /** @private
    Whenver the content "status" property changes, relay out.
  */
  _scac_contentStatusDidChange: function() {
    this.notifyPropertyChange('status');
  }
  
});

// ARRAY.JS END


//var foundation = require("./frameworks/foundation");

// mixin stuff
//SC.mixin(SC, foundation);
