import Vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css';
import {
  Aside,
  Button,
  Card,
  Col,
  Container,
  Form,
  FormItem,
  Header,
  Input,
  Main,
  Menu,
  MenuItem,
  Row,
  Submenu,
  Message,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Breadcrumb,
  BreadcrumbItem
} from 'element-ui';

Vue.use(Button);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Header);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Dropdown);
Vue.use(DropdownItem);
Vue.use(DropdownMenu);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);


Vue.prototype.$message = Message;
