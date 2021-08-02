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
  BreadcrumbItem,
  Table,
  TableColumn,
  Loading,
  Switch,
  Pagination,
  MessageBox,
  Dialog,
  Upload,
  Select,
  Option,
  Tag,
  Cascader,
  Tree,
  Collapse,
  CollapseItem,
  Image,
  Tabs,
  TabPane,
  Alert,
  InputNumber,
  Popover
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
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Loading);
Vue.use(Switch);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Upload);
Vue.use(Select);
Vue.use(Option);
Vue.use(Tag);
Vue.use(Cascader);
Vue.use(Tree);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Image);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Alert);
Vue.use(InputNumber);
Vue.use(Popover);


Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
