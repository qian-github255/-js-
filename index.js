// 定义一个全局变量用来存储列表信息，以便于在进行编辑的时候进行数据回填
var tableData = [];
var editForm = document.getElementById('student-edit-form');
var modal = document.getElementsByClassName('modal')[0];

var nowPage = 1;
var pageSize = 5;
var allPage = 1;



// 为了获得添加事件
function bindEvent() {
    // 为了处理多个列表的存在，使用事件委托来进行编辑
    var menuList = document.getElementsByClassName("menu")[0];
    menuList.onclick = function (e) {
        // console.log(e.target);e.target 存储的是点击的元素
        // e.target.tagName是一个存在于e.target里面的方法可以显示点击元素的类名
        if (e.target.tagName == 'DD') {

            //循环查找菜单栏中所有的兄弟节点的样式进行取消
            // 运用下面封装的函数来进行寻找兄弟节点
            // var siblingMenu = getSibling(e.target)
            // for(var i = 0; i < siblingMenu.length; i ++){
            //     // 去掉所有含有active的元素的class类型
            //     siblingMenu[i].classList.remove('active');
            // }
            // //运用classList里面的add属性来进行添加class属性，从而实现对css的变相操作
            // e.target.classList.add('active');   
            //使用下面的封装函数进行数据优化
            changeStyle(e.target);


            var id = e.target.getAttribute('data-id');
            // console.log(id);
            // console.log(e.target.dataset);  //dataset 可以显示所有是data-结构的元素
            var showContent = document.getElementById(id);

            // var siblingContent = getSibling(showContent);
            // 遍历兄弟节点，使得所有的兄弟节点全部隐藏,使得左边的列名与右侧的内容对应
            // for(var j = 0; j < siblingContent.length; j ++){
            //     siblingContent[j].style.display = 'none';
            // }
            // // console.log(showContent);
            // // console.log(getSibling(showContent));验证封装函数的正确性
            // showContent.style.display = 'block';

            //使用下面的封装函数进行优化
            changeStyle(showContent);
        } else {
            // return false;
        }
    }

    var studentAddBtn = document.getElementById('student-add-submit');
    // console.log(studentAddBtn);
    studentAddBtn.onclick = function () {
        var form = document.getElementById('student-add-form');
        var data = getFormData(form);
        if (data) {
            // data.appkey = "qian_1585574047200";
            // //向后台发送数据局进行存储，会返回存储是否成功，若存储成功则返回success 否则为fail
            // var data = saveData('http://open.duyiedu.com/api/student/addStudent', data);
            // console.log(data);
            // // 保存成功，弹出弹框进行跳转，然后进行重置表单
            // if(data.status == 'success'){
            //     alert('新增学生成功');
            //     var form = document.getElementById('student-add-form');
            //     form.reset();
            //     var studentListDom = document.getElementsByTagName('dd')[0];
            //     studentListDom.onclick();
            // }else{
            //     alert(data.msg);
            // }

            // 使用封装函数进行数据优化
            transferData('/api/student/addStudent',data,function (){
                alert('新增学生成功');
                var form = document.getElementById('student-add-form');
                form.reset();
                getTableData();
                var studentListDom = document.getElementsByTagName('dd')[0];
                studentListDom.onclick();
            })
        }
        return false;
    }

    var tbody = document.getElementById('tBody');
    tbody.onclick = function(e){
        // console.log(e.target);
        // 判断当前点击的按钮是不是编辑按钮
        if(e.target.classList.contains('edit')){
           
            modal.style.display = 'block';
            var index = e.target.dataset.index;
            // console.log(tableData[index]);
            //将学生数据回填到编辑表单中  利用下面的封装函数进行数据回填
            renderForm(tableData[index]);
            // 利用e.target.parentNode.parentNode寻找属于那一列数据
            // console.log(e.target.parentNode.parentNode);
        }// 判断当前按钮是不是删除按钮
        else if (e.target.classList.contains('del')){
            var isDel = confirm('确认删除');
            if(isDel){
                var index = e.target.dataset.index;
                transferData('/api/student/delBySno',{
                    sNo : tableData[index].sNo
                },function(){
                    alert('删除成功');
                    getTableData();
                })
            }
        }
    }
    // 提交按钮进行数据传输
    var studentEditBtn = document.getElementById('student-edit-submit');
    studentEditBtn.onclick = function (e) {
        // 阻止默认行为
        e.preventDefault();
        //获取编辑表单中的数据然后往后端进行传送
        var data = getFormData(editForm);
        // console.log(data); 
        if(data){
            transferData('/api/student/updateStudent',data,function(){
                alert('修改成功');
                modal.style.display = 'none';
                getTableData();
            })
        }     
    }
    modal.onclick = function () {
        modal.style.display = 'none';
    }

    var modalContent = document.getElementsByClassName('modal-content')[0];
    modalContent.onclick = function (e) {
        //取消子元素的冒泡，避免无序的消失
        e.stopPropagation();
    }
    // 为翻页功能添加事件
    var turnPage = document.getElementsByClassName('turn-page')[0];
    turnPage.onclick = function (e){
        // 获取下一页数据
        if(e.target.id == 'next-btn'){
            nowPage++;
            getTableData();
        //获取上一页数据
        }else if (e.target.id == 'prey-btn'){
            nowPage --;
            getTableData();
        }
    }

}

//封装一个函数用来获取所有的兄弟节点
function getSibling(node) {
    var parent = node.parentNode;
    var children = parent.children;
    var result = [];
    for (var i = 0; i < children.length; i++) {
        if (children[i] != node) {
            result.push(children[i]);
        }
    }
    return result;
}

// 封装一个函数进行左右切换功能用来节省代码
function changeStyle(node) {
    var siblingMenu = getSibling(node);
    for (var i = 0; i < siblingMenu.length; i++) {
        siblingMenu[i].classList.remove('active');
    }
    node.classList.add('active');
}

// 封装一个函数进行获取表单元素数据
function getFormData(form) {
    
    //form表单下的input框具有以下的特性，可以通过下面方法获取值
    var name = form.name.value;
    var sex = form.sex.value;
    var sNo = form.sNo.value;
    var email = form.email.value;
    var birth = form.birth.value;
    var phone = form.phone.value;
    var address = form.address.value;
    
    //判断是否信息完整，完整就将数据传到后端，不完整就弹窗
    if (!name || !number || !birth || !phone || !address || !email) {
        alert('信息填写不完全，请检查后提交')
        return false;
    }
    // 最终数据将会传向后台，在return里面进行将数据格式化
    return {
        sNo: sNo,
        name: name,
        sex: sex,
        birth: birth,
        phone: phone,
        address: address,
        email: email
    }


}

//数据请求交互函数
function transferData (url,data,success) {
    data.appkey = 'saisai_1585927570134';
    var result = saveData('http://open.duyiedu.com' + url , data);
    if(result.status == 'success'){
       success(result.data);
    }else{
        alert(result.msg);
    }
}

//获取学生列表数据
function getTableData(){
    transferData('/api/student/findByPage',{
        page : nowPage,
        size : pageSize
    },function(data){
        console.log(data);
        tableData = data.findByPage;
        allPage = Math.ceil(data.cont/pageSize);
        renderTable(data.findByPage);

    })
}

// 渲染页面数据
function renderTable (data) {
    var str = '';
    data.forEach(function (item,index){
        str += ` <tr>
        <td>${item.sNo}</td>
        <td>${item.name}</td>
        <td>${item.sex == 0 ? 'male' : 'female'}</td>
        <td>${item.email}</td>
        <td>${(new Date().getFullYear() - item.birth)}</td>
        <td>${item.phone}</td>
        <td>${item.address}</td>
        <td>
            <button class="edit btn" data-index = ${index}>编辑</button>
            <button class="del btn" data-index = ${index}>删除</button>
        </td>
    </tr>`
    })
    var tBody = document.getElementById('tBody');
    tBody.innerHTML = str;
    var nextPage = document.getElementById('next-btn');
    var prevPage = document.getElementById('prey-btn');
    // 判断显示下一页按钮
    if(allPage > nowPage){
        nextPage.style.display = 'inline-block';
    }else{
        nextPage.style.display = 'none';
    }
    // 判断显示上一页按钮
    if(nowPage > 1){
        prevPage.style.display = 'inline-block';
    }else{
        prevPage.style.display = 'none';
    }
}

// 编辑表单的数据回填   接受的参数是学生的信息
function renderForm (data) {
    // var form = document.getElementById('student-edit-form');
    // form 表单不仅可以通过id值进行获取值，也可以通过name值进行获取
    // form.name.value = data.name;
    // form.sex.value = data.sex;
    // form.number.value = data.sNo;
    // form.email.value = data.email;
    // form.phone.value = data.phone;
    // form.address.value = data.address;
    // form.birth.value = data.birth;
    // 使用遍历进行数据回填，节省代码
    for(var prop in data){
        if(editForm[prop]){
            editForm[prop].value = data[prop];
        }
    }
}

bindEvent();
//手动触发click事件使得页面不那么空
document.getElementsByClassName('active')[0].click();
// 运行获取数据
getTableData();

// 向后端存储数据
function saveData(url, param) {
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open('GET', url + '?' + param, false);
    } else if (typeof param == 'object') {
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open('GET', url + '?' + str, false);
    } else {
        xhr.open('GET', url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    }
    xhr.send();
    return result;
}

// var data = saveData('http://open.duyiedu.com/api/student/findAll',{
//     appkey : 'qian_1585574047200'
// });
// console.log(data);