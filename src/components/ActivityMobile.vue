<template>
    <div class="activity_container">
        <div class="avatar_box">
            <img src="../assets/logo.png" alt="">
        </div>
        <!--活动详情获取-->
        <div class="detail_box">
            <h3>活动详情：</h3>
            <p>活动名称：{{activityInfo.activity_name}}</p>
            <p>活动描述：{{activityInfo.activity_desc}}</p>
            <p>活动开始时间：{{activityInfo.activity_start_time| dataFormat}}</p>
            <p>活动结束时间：{{activityInfo.activity_end_time| dataFormat}}</p>
            <p>报名截止时间：{{activityInfo.activity_deadline| dataFormat}}</p>
            <p>签到起始时间：{{activityInfo.activity_signIn_time| dataFormat}}</p>
            <p>签到结束时间：{{activityInfo.activity_signOut_time| dataFormat}}</p>
            <p>签到位置：{{activityInfo.activity_site}}</p>
        </div>
        <!--参加活动的个人信息获取-->
        <div v-if="studentInfo.statusFlag === 1">
            <h3>个人信息：</h3>
            <van-form @submit="participateInActivity">
                <van-field
                        v-model="studentInfo.username"
                        label="学号"
                        placeholder="学号"
                        required
                        :rules="[
                            { validator, message: '请输入正确的学号' ,trigger: 'onBlur'}
                        ]"
                />
                <van-field
                        v-model="studentInfo.password"
                        type="password"
                        label="密码"
                        placeholder="密码"
                        required
                        :rules="[{required: true, message: '请输入密码', trigger: 'onBlur'}]"
                />
                <div style="margin: 16px;">
                    <van-button round block type="info" native-type="submit" icon="gift-o">
                        参加活动
                    </van-button>
                </div>
            </van-form>
        </div>
        <!--活动签到-->
        <div v-if="studentInfo.statusFlag===2">
            <h3>活动签到：</h3>
            <van-form @submit="signInActivity">
                <van-field
                        v-model="studentInfo.username"
                        name="用户名"
                        label="用户名"
                        placeholder="用户名"
                        :rules="[{ validator, message: '请输入正确的学号' }]"
                />
                <van-field
                        v-model="studentInfo.password"
                        type="password"
                        name="密码"
                        label="密码"
                        placeholder="密码"
                        :rules="[{ required: true, message: '请输入密码' }]"
                />
                <div style="margin: 16px;">
                    <van-button round block type="info" native-type="submit"
                                icon="https://img.yzcdn.cn/vant/logo.png">
                        活动签到
                    </van-button>
                </div>
                <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center"></el-amap>
            </van-form>
        </div>
        <!--活动评价信息-->
        <div v-if="studentInfo.statusFlag === 3">
            <h3>
                活动评价：
            </h3>
            <van-form @submit="evaluateActivity">
                <van-field name="rate" label="评分">
                    <template #input>
                        <van-rate
                                v-model="activityEvaluation.rate"
                                :size="25"
                                color="#ee0a24"
                                void-icon="star"
                                void-color="#eee"
                                :rules="[{ required: true, message: '请您评价本次活动' }]"
                        />
                    </template>
                </van-field>
                <van-field
                        v-model="activityEvaluation.message"
                        rows="2"
                        autosize
                        label="留言"
                        type="textarea"
                        placeholder="请输入留言"
                        show-word-limit
                        :rules="[{ required: true, message: '您对本次活动有什么看法' }]"
                />
                <div style="margin: 16px;">
                    <van-button round block type="info" native-type="submit">
                        提交
                    </van-button>
                </div>
            </van-form>
        </div>

    </div>

</template>

<script>

    function infoReset() {
        this.studentInfo.username = ''
        this.studentInfo.password = ''
        this.activityEvaluation.message = ''
        this.activityEvaluation.rate = 5
    }

    export default {
        data() {
            let self = this;
            return {
                studentInfo: {
                    statusFlag: 2,
                    username: '',
                    password: '',
                },
                activityInfo: {},
                /*获取当前位置*/
                center: [121.59996, 31.197646],
                lng: 0,
                lat: 0,
                loaded: false,
                plugin: [
                    {
                        pName: "Geolocation", //定位
                        events: {
                            init(o) {
                                // o 是高德地图定位插件实例
                                o.getCurrentPosition((status, result) => {
                                    if (result && result.position) {
                                        console.log(status, result);
                                        self.lng = result.position.lng; //设置经度
                                        self.lat = result.position.lat; //设置维度
                                        self.center = [self.lng, self.lat]; //设置中心坐标
                                        self.loaded = true;
                                        self.$nextTick();
                                    }
                                });
                            }
                        }
                    }
                ],
                /*活动评价*/
                activityEvaluation: {
                    rate: 5,
                    message: '',
                }
            };
        },
        created() {
            this.getActivityDetail()
        },
        methods: {
            async getActivityDetail() {
                const {data: res} = await this.$http.get('getactivitybyid/1')
                /*if (res.meta.status !== 200) {
                    return MessageBox.alert('提示', '活动信息获取失败')
                }*/
                this.activityInfo = res.data
                console.log(this.activityInfo)
            },
            validator(val) {
                return /\d{11}/.test(val);
            },
            async participateInActivity() {
                /*验证学生这次活动的状态*/
                await this.getStudentActivityStatus();
                const {data: res} = await this.$http.put('participateInActivity', {
                    studentInfo: this.studentInfo,
                    activityId: this.activityInfo.activity_id
                });
                if (res.meta.status !== 200) {
                    this.$toast.fail('学号或密码错误')
                    infoReset.call(this);
                    return;
                }
                this.$toast.success('活动参加成功')
                this.studentInfo.statusFlag = 2;
                infoReset.call(this);
            },
            async evaluateActivity() {
                const {data: res} = await this.$http.put('evaluateActivity', {
                    activityEvaluation: this.activityEvaluation,
                    activityId: this.activityInfo.activity_id
                });
                if (res.meta.status !== 200) {
                    this.$toast.fail('活动评价失败')
                    infoReset.call(this);
                    return;
                }
                this.$toast.success('活动评价成功')
                this.studentInfo.statusFlag = 3;
                infoReset.call(this);
            },
            async getStudentActivityStatus() {
                const {data: res} = await this.$http.get('getStudentActivityStatusInfo', {
                    params: {
                        studentId: this.studentInfo.username,
                        activityId: this.activityInfo.activity_id
                    }
                });
                if (res.meta.status !== 200) {
                    this.$toast.fail('学号不存在')
                    infoReset.call(this);
                    return;
                }
                if (res.data.statusFlag !== 1) {
                    this.$toast.fail('您已参加活动')
                    infoReset.call(this);
                    return;
                }
                this.studentInfo.statusFlag = res.data.statusFlag

            },
            async signInActivity() {
                const dis = this.getDistance(this.activityInfo.activity_loc.lat,
                    this.activityInfo.activity_loc.lng, this.lat, this.lng)
                if (dis * 1000 > 200) {
                    /*距离小于200,可以签到*/
                    this.$toast.fail('签到失败，您距离指定的活动地点较远')
                    infoReset.call(this);
                }
                const {data: res} = await this.$http.put('SignInActivity', {
                    studentInfo: this.studentInfo,
                    activityId: this.activityInfo.activity_id
                });
                if (res.meta.status !== 200) {
                    this.$toast.fail('学号或密码错误')
                    infoReset.call(this);
                    return;
                }
                this.$toast.success('签到成功')
                this.studentInfo.statusFlag = 3;
                infoReset.call(this);
            },
            rad(d) {
                return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
            },
            getDistance(lat1, lng1, lat2, lng2) {

                const radLat1 = this.rad(lat1);
                const radLat2 = this.rad(lat2);
                const a = radLat1 - radLat2;
                const b = this.rad(lng1) - this.rad(lng2);
                let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
                    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
                s = s * 6378.137;// EARTH_RADIUS;
                s = Math.round(s * 10000) / 10000; //输出为公里
                //s=s.toFixed(4);
                return s;
            }


        },
    }
</script>

<style lang="less" scoped>


    .avatar_box {
        height: 60px;
        width: 60px;
        border: 0.5px solid #eeeeee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #dddddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #ffffff;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #eeeeee;
        }
    }

    .detail_box {
        margin-top: 60px;
    }

    .activity_container {
        margin: 20px;
    }


</style>
