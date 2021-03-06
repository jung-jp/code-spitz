
/**
 * todo 모델
 * @param {*} _id 
 * @param {*} _importance 
 * @param {*} _title 
 * @param {*} _contents 
 * @param {*} _reg_dt 
 */
const TodoModel = class extends Model{
    constructor(_id = err(), _importance = '1', _title = '', _contents = '', _reg_dt = new Date()){
        super();
        prop(this, {_id});
        this.edit(_importance, _title, _contents, _reg_dt);
    }
    edit(_importance = '1', _title = '', _contents = '', _reg_dt){
        prop(this, {_importance, _title, _contents, _reg_dt});
        this.notify();
    }
    get id(){return this._id;}
    get importance(){return this._importance;}
    get reg_dt(){return this._reg_dt;}
    get title(){return this._title}
    get contents(){return this._contents}
};

/**
 * todo 리스트 모델
 * @param {*} isSingleton 
 */
const TodoListModel = class extends Model{
    constructor(isSingleton){
        super(isSingleton);
        if(!this._list) prop(this, {_list:[
            new TodoModel(1, '1', '세탁소에서 세탁물 찾아오기', 'contents_1'),
            new TodoModel(2, '2', '두줄인 경우 이렇게 텍스트가 잔연스럽게 떨어져야 합니다.두줄인 경우 이렇게 텍스트가 잔연스럽게 떨어져야 합니다.두줄인 경우 이렇게 텍스트가 잔연스럽게 떨어져야 합니다.', 'contents_2'),
            new TodoModel(3, '1', '완료된 할일의 경우 이렇게 line-through가 필요합니다.', 'contents_3'),
            new TodoModel(4, '1', '세탁소에서 세탁물 찾아오기', 'contents_4'),
            new TodoModel(5,  '', '두줄인 경우 이렇게 텍스트가 잔연스럽게 떨어져야 합니다.두줄인 경우 이렇게 텍스트가 잔연스럽게 떨어져야 합니다.두줄인 경우 이렇게 텍스트가 잔연스럽게 떨어져야 합니다.', 'contents_5'),
            new TodoModel(6, '1', '완료된 할일의 경우 이렇게 line-through가 필요합니다.', 'contents_6'),
            new TodoModel(10, '1', '생각보다 시간이 오래걸려서.. 완료를 못했네요.', 'contents_0')
        ]});
    }
    get list(){return this._list;}
    remove(id){
        const {_list:list} = this;
        if(!list.some((v, i)=>{
            if(v.id == id){
                list.splice(i, 1);
                return true;
            }
        })) err();
        this.notify();
    }
    addItem(importance = '1', title = '', contents = '', reg_dt = new Date()) {
        this._list.push(new TodoModel(this._list.length, importance, title, contents, reg_dt));
    }
    get(id){
        let result;
        if(!this._list.some(v=>v.id == id ? (result = v) : false)) err();
        return result;
    }
};

/**
 * todo ViewModel
 *  뷰, 모델 관련 처리 및 통지.
 * @param {*} isSingleton 
 */
const Todo = class extends ViewModel{
	constructor(isSingleton){
        super(isSingleton);
    }

    /**
     * 뷰모델 실행시 기본 호출 메소드 
     * @param {*} id 
     */
	base(id){
		prop(this, {_id:id});
        const model = new TodoListModel(true);
		model.add(this.observer);
		model.notify();
    }

    /**
     * 모델의 변경을 통지 받아 view를 notify()한다. (view.render() 실행됨)
     * @param {*} model 
     */
	listen(model){
        if(!is(model, TodoListModel)) err();
        this.notify(model.list);
    }

    $list(){

    }

    /**
     * 이벤트 처리 - 삭제
     */
	$remove(){
		const model = new TodoListModel(true);
        model.remove(this._id);
		this.$list();
    }
    
    /**
     * 이벤트 처리 - 추가
     */
    $add(el) {
        const importance = sel('#importance').value;
        const title = sel('#title').value;

        if(!title) {
            alert('할일을 입력하세요.');
            return;
        }
        
        const model = new TodoListModel(true);
        model.addItem(importance, title);
        this.notify(model.list);
    }

    /**
     * 이벤트 처리 - 수정
     */
	$edit(importance, title, contents){
        const model = new TodoListModel(true).get(this._id);
        model.edit(importance, title, contents);
        this.notify(model.list);
    }
    
    $sortImpt() {

    }

    $sortComp() {

    }
};

/**
 * todo View
 * 뷰 생성 및 처리.
 * @param {*} isSingleton 
 */
const TodoView = class extends View{
    constructor(isSingleton){
        super(el('div', 'className', 'todo'), isSingleton);
    }
    
    importance(v) {
        const impo = {
            '' : '중요도',
            '1' : '매우중요',
            '2' : '중요',
            '3' : '보통',
        }
        return impo[v] || '-';
    }

	render(v){
        const {viewModel, view} = this;
        append(el(view, 'innerHTML', ''),
            append(el('div', 'className', 'write_wrap'), 
                append(el('select', 'id', 'importance'),
                    el('option', 'innerHTML', '중요도', 'value', ''),
                    el('option', 'innerHTML', '매우중요', 'value', '1'),
                    el('option', 'innerHTML', '중요', 'value', '2')
                ),
                append(el('div', 'className', 'input_area'),
                    el('input', 'type', 'text', 'id', 'title', 'placeholder', '할 일을 입력하세요.')
                ),
                el('button', 'type', 'button', 'id', 'btn_add', 'innerHTML', '추가',
                'addEventListener', ['click', _=>viewModel.$add()])
            ),
            
            append(el('div', 'className', 'sort_wrap'), 
                append(el('div', 'className', 'impt'),
                    el('input', 'type', 'checkbox', 'value', 'all', 'id', 'sort_importance_all',
                    'addEventListener', ['click', _=>viewModel.$sortImpt('all')]), el('label', 'for', 'sort_importance_all', 'innerHTML', '모두'),                    
                    el('input', 'type', 'checkbox', 'value', '1', 'id', 'sort_importance_1'), el('label', 'fora', 'sort_importance_1', 'innerHTML', '매우중요'),                    
                    el('input', 'type', 'checkbox', 'value', '2', 'id', 'sort_importance_2'), el('label', 'fora', 'sort_importance_2', 'innerHTML', '중요'),                    
                    el('input', 'type', 'checkbox', 'value', '3', 'id', 'sort_importance_3'), el('label', 'fora', 'sort_importance_3', 'innerHTML', '보통')                    
                ),
                append(el('div', 'className', 'sort_compt'),
                    el('input', 'type', 'checkbox', 'value', 'all', 'id', 'sort_complate_all',
                    'addEventListener', ['click', _=>viewModel.$sortComp('all')]), el('label', 'for', 'sort_complate_all', 'innerHTML', '모두'),                    
                    el('input', 'type', 'checkbox', 'value', 'y', 'id', 'sort_complate_y'), el('label', 'for', 'sort_complate_y', 'innerHTML', '완료'),                    
                    el('input', 'type', 'checkbox', 'value', 'n', 'id', 'sort_complate_n'), el('label', 'for', 'sort_complate_n', 'innerHTML', '미완료')
                ),
            ),

            append(el('div', 'className', 'todo_list'), 
                append(el('ul'),  ...v.map(v=>append(
                    append(el('li', 'className', 'todo'),
                        append(el('div', 'className', 'todo_cont'),
                            append(el('label'), 
                                el('input', 'type', 'checkbox', 'value', 'all'),
                                el('i', 'innerHTML', '선택')),
                            el('span', 'innerHTML', `중요도 : ${this.importance(v.importance)}`),                
                            el('span', 'innerHTML', `추가일 : ${v.reg_dt.getFullYear()}.${v.reg_dt.getMonth()}.${v.reg_dt.getDay()}`),
                            append(el('p', 'className', 'subject'), 
                                el('a', 'href', '##', 'innerHTML', v.title)),
                            el('button', 'type', 'button', 'className', 'btn_dnd', 'innerHTML', 'drag and drop')
                        )
                    )
                )))
            )
        );

	}
};
