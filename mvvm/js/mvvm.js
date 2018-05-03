/**
 * app 구동을 위한 처리, 라이팅 처리.
 * @param {*} _parent 
 */
const App = class{
    constructor(_parent = err()){
        prop(this,{_parent, _table:new Map});
    }
    add(k = err(), vm = err(), view = err()){
        this._table.set(k, [vm, view]);
    }

    // 라우팅 처리
    route(path = err(), ...arg){
        // 라우트 키(컨트롤명):세부액션(기본base)
        const [k, action = 'base'] = path.split(':');
        // 키가 없으면 예외처리.(유요성 체크)
        if(!this._table.has(k)) return;
        // 익명함수를 실행, vm, view 객체를 생성해 배열을 해체하여 vm, view 변수에 담는다.
        const [vm, view] = this._table.get(k).map(f=>f());
        // view가 viewModel을 알수 있도록
        view.viewModel = vm;
        // 뷰모델의 액션을 호출, 넘겨받은 파라미터를 배열로 전달.
        vm[action](...arg);
        // _parent에 html 생성(초기화)
        append(attr(sel(this._parent), 'innerHTML', ''), view.view);
    }
};

/**
 * WeakMap을 상속해서 Singleton 객체 생성에 이용.
 */
const Singleton = class extends WeakMap{
    has(){err();}
    get(){err();}
    set(){err();}
    getInstance(v){
        if(!super.has(v.constructor)) super.set(v.constructor, v);
        return super.get(v.constructor);
    }
};

// 객체를 Singleton 으로 생성하기 위한 인스턴스.
const singleton = new Singleton;

// observer 등록 interface
const Observer = class{
	observe(v){override();}
};

// notify를 처리를 위한 부모 class
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

/**
 * 뷰 생성을 위한 추상 클래스.
 *  - 뷰모델을 알고, 뷰모델에 옵져버로 등록 되어 있어. 뷰모델의 변경이 있을때 통지 받을수 있다. render() 실행
 * @param {*} _view 
 * @param {*} isSingleton 
 */
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

/**
 * 모델 생성을 휘한 부모 클래스
 * @param {*} isSingleton 
 */
const Model = class extends Subject{
    constructor(isSingleton){
        super();
        if(isSingleton) return singleton.getInstance(this);
    }
};

/**
 * 모델의 옵져버 처리를위한 추상클래스.
 *  - 뷰모델을 모델의 objserver로 등록하고 모델이 변경되면 뷰모델에 통지해준다. listen()
 * @param {*} _viewmodel 
 */
const ViewModelObserver = class extends Observer{
	constructor(_viewmodel){
		super();
		prop(this, {_viewmodel});
	}
	observe(v){this._viewmodel.listen(v);}
}

/**
 * 뷰모델 구현, nofi 처리를 위한 추상클래스
 * @param {*} isSingleton 
 */
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