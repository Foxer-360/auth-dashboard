// import { Form, Input } from 'antd';
// import { WrappedFormUtils } from 'antd/lib/form/Form';
// import * as React from 'react';

// export interface IProperties {
//   form: WrappedFormUtils;
//   values?: {
//     avatar: string;
//     name: string;
//     email: string;
//   };
// }

// const UserForm = ({ form, values }: IProperties) => {
//   const { getFieldDecorator } = form;

//   // tslint:disable-next-line:no-console
//   console.log(`%c[UserDetail]%c Rendered UserDetail form...`, 'color: green; font-weight: bold', 'color: green');

//   return (
//     <Form layout="inline" hideRequiredMark={true}>
//       <Form.Item label="User Name">
//         {getFieldDecorator(
//           'name',
//           {
//             initialValue: values ? values.name : '',
//             rules: [{ required: true, message: 'Username have to be defined!' }],
//           }
//           )(<Input />)
//         }
//       </Form.Item>
//       <Form.Item label="Email">
//         {getFieldDecorator(
//           'email',
//           {
//             initialValue: values ? values.email : '',
//             rules: [{ required: true, message: 'Email have to be defined!' }],
//           }
//           )(<Input disabled={values ? true : false} />)
//         }
//       </Form.Item>
//       <Form.Item label="Avatar">
//         {getFieldDecorator(
//           'avatar',
//           {
//             initialValue: values ? values.avatar : '',
//           }
//           )(<Input />)}
//       </Form.Item>
//     </Form>
//   );
// };

// export default Form.create({ name: 'user_detail '})(UserForm);

import Form from './Form';

export default Form;
