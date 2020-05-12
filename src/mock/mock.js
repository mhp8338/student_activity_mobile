import Mock from 'mockjs'


// mock需要给三个参数,url(与axios请求是传的url一致,我这个是本地启动的项目就直接用本地域名了)
// 请求类型: get post...其他看文档
// 数据处理函数,函数需要return数据

/*根据ID查活动*/
Mock.mock(RegExp('http://localhost:8082/test/getactivitybyid'), 'get', () => {

    return {
        "data": {
            "activity_id": 1,
            "activity_name": "asfdsd",
            "activity_desc": "这是一个活动活动aaaaaaaaaaaaaa这是一个活动活动aaaaaaaaaaaaaa这是一个活动活动aaaaaaaaaaaaaa这是一个活动活动aaaaaaaaaaaaaa这是一个活动活动aaaaaaaaaaaaaa",
            "activity_limit_num": 40,
            "activity_term": 1,
            "activity_start_time": 1512954923,
            "activity_end_time": 1512954923,
            "activity_deadline": 1512954923,
            "activity_signIn_time": 1512954923,
            "activity_signOut_time": 1512954923,
            "activity_site": "威海校区",
            "activity_loc": {
                "lng": 104.0428,
                "lat": 30.542094
            }

        },
        "meta": {
            "msg": "获取成功",
            "status": 200
        }
    }
})

/*查询学生该活动标志*/
Mock.mock(RegExp('http://localhost:8082/test/getStudentActivityStatusInfo'), 'get', () => {

    return {
        "data": {
            "statusFlag": 1
        },
        "meta": {
            "msg": "获取成功",
            "status": 200
        }
    }
})

/*参加活动*/
Mock.mock(RegExp('http://localhost:8082/test/participateInActivity'), 'put', () => {

    return {
        "data": {
            "username": '',
            "password": '',
            "statusFlag": 1
        },
        "meta": {
            "msg": "获取成功",
            "status": 200
        }
    }
})

/*活动签到*/
Mock.mock(RegExp('http://localhost:8082/test/SignInActivity'), 'put', () => {

    return {
        "data": {
            "username": '',
            "password": '',
            "statusFlag": 1
        },
        "meta": {
            "msg": "获取成功",
            "status": 200
        }
    }
})

/*活动评价*/
Mock.mock(RegExp('http://localhost:8082/test/evaluateActivity'), 'put', () => {

    return {
        "data": {
            "rate": '',
            "message": '',
            "statusFlag": 3
        },
        "meta": {
            "msg": "获取成功",
            "status": 200
        }
    }
})

