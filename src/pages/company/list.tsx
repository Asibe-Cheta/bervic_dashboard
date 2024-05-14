import React from 'react';
import { List, Table, Space } from 'antd';
import { CreateButton, EditButton, DeleteButton, FilterDropdown } from '@refinedev/antd';
import { useTable, HttpError, getDefaultFilter, useGo } from '@refinedev/core';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import CustomAvatar from '@/components/custom-avatar';
import { Text } from '@/components/text';
import { COMPANIES_LIST_QUERY } from '@/graphql/queries';
import { CompaniesListQuery } from '@/graphql/types';
import { currencyNumber } from '@/utilities';
import { GetFieldsFromList } from '@refinedev/nestjs-query';

interface Sum {
  value: number;
}

interface DealAggregate {
  sum: Sum;
}

interface Company {
  key: string;
  name: string;
  age: number;
  address: string;
  avatarUrl?: string | null;
  dealsAggregate?: DealAggregate[];
}

export const CompanyList = ({ children }: React.PropsWithChildren) => {
  const go = useGo();
  const { tableQueryResult } = useTable<
    GetFieldsFromList<CompaniesListQuery>,
    HttpError,
    GetFieldsFromList<CompaniesListQuery>
  >({
    resource: 'companies',
    filters: {
      initial: [
        {
          field: 'name',
          operator: 'contains',
          value: undefined,
        },
      ],
    },
    pagination: {
      pageSize: 12,
    },
    sorters: {
      initial: [
        {
          field: 'createdAt',
          order: 'desc',
        },
      ],
    },
    meta: {
      gqlQuery: COMPANIES_LIST_QUERY,
    },
  });

  const { data, isLoading } = tableQueryResult;

  const companies = data?.data ?? [];

  return (
    <div>
      <List>
        <CreateButton
          onClick={() => {
            go({
              to: {
                resource: 'companies',
                action: 'create',
              },
              options: {
                keepQuery: true,
              },
              type: 'replace',
            });
          }}
        />
        <Table
          dataSource={companies}
          loading={isLoading}
          pagination={{ pageSize: 12 }}
        >
          <Table.Column<Company>
            dataIndex="name"
            title="Company Title"
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Company" />
              </FilterDropdown>
            )}
            render={(value, record) => (
              <Space>
                <CustomAvatar shape="square" name={record.name} src={record.avatarUrl ?? undefined} />
                <Text style={{ whiteSpace: 'nowrap' }}>{record.name}</Text>
              </Space>
            )}
          />
          <Table.Column<Company>
            dataIndex="totalRevenue"
            title="Open deals amount"
            render={(value, company) => (
              <Text>{currencyNumber(company?.dealsAggregate?.[0]?.sum?.value || 0)}</Text>
            )}
          />
          <Table.Column<Company>
            dataIndex="id"
            title="Actions"
            fixed="right"
            render={(value) => (
              <Space>
                <EditButton hideText size="small" recordItemId={value} />
                <DeleteButton hideText size="small" recordItemId={value} />
              </Space>
            )}
          />
        </Table>
      </List>
      {children}
    </div>
  );
};
