import React from 'react';
import { Select } from 'antd';
import s from 'antd/dist/antd.less';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';

function NewTestFormSelect({ query, placeholder, onChange }) {
  return (
    <Query query={query.query}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;

        return (
          <Select
            showSearch
            placeholder={placeholder}
            optionFilterProp="children"
            onChange={onChange}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {data[query.name].map(d => (
              <Select.Option key={d.id} value={d.id}>
                {d.name}
              </Select.Option>
            ))}
          </Select>
        );
      }}
    </Query>
  );
}

NewTestFormSelect.propTypes = {
  query: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

NewTestFormSelect.defaultProps = {
  placeholder: '',
};

export default withStyles(s)(NewTestFormSelect);
