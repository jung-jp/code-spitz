const App = class{
    constructor(_parent = err()){
        prop(this,{_parent, _table:new Map});
    }
    add(k = err(), vm = err(), view = err()){
        this._table.set(k, [vm, view]);
    }
    route(path = err(), ...arg){
        const [k, action = 'base'] = path.split(':');
        if(!this._table.has(k)) return;
        const [vm, view] = this._table.get(k).map(f=>f());
		view.viewModel = vm;
		vm[action](...arg);
        append(attr(sel(this._parent), 'innerHTML', ''), view.view);
    }
};

const Singleton = class extends WeakMap{
    has(){err();}
    get(){err();}
    set(){err();}
    getInstance(v){
        if(!super.has(v.constructor)) super.set(v.constructor, v);
        return super.get(v.constructor);
    }
};

const singleton = new Singleton;

const Observer = class{
	observe(v){override();}
};

const Subject = class extends Set{
	add(v){
		if(!is(v, Observer)) err();
        super.add(v);
		return this;
	}
    delete(v){
		if(!is(v, Observer)) err();
        super.delete(v);
	}
    has(v){
        if(!is(v, Observer)) err();
        return super.has(v);
    }
	notify(...arg){
        this.forEach(v=>arg.length ? v.observe(...arg) : v.observe(this));
    }
}

const Model = class extends Subject{
    constructor(isSingleton){
        super();
        if(isSingleton) return singleton.getInstance(this);
    }
};

const View = class extends Observer{
    constructor(_view = err(), isSingleton = true){
		super();
        return prop(isSingleton ? singleton.getInstance(this) : this, {_view});
    }
	
	get viewModel(){return this._viewModel;}
	set viewModel(_viewModel){
		prop(this,{_viewModel});
		_viewModel.add(this);
	}
	
	observe(...arg){this.render(...arg);}
	render(){override();}
	get view(){return this._view;}
};

const ViewModelObserver = class extends Observer{
	constructor(_viewmodel){
		super();
		prop(this, {_viewmodel});
	}
	observe(v){this._viewmodel.listen(v);}
}
const ViewModel = class extends Subject{
    constructor(isSingleton = true){
		super();
		const target = isSingleton ? singleton.getInstance(this) : this;
		prop(target, {_observer:new ViewModelObserver(target)});
        return target;
    }
	get observer(){return this._observer;}
    listen(model){}
};