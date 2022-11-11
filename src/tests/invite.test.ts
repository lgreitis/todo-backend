import expressConfig from '@config/express';
import {
  AddUserFromInviteDto,
  CreateInviteDto,
  CreateInvitedUserDto,
  EditInviteDto,
} from '@dtos/invite.dto';
import { CreateOrganizationDto } from '@dtos/organization.dto';
import { CreateUserDto } from '@dtos/user.dto';
import { authRoute, inviteRoute, organizationRoute, userRoute } from '@routes';
import request from 'supertest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let server: any;

beforeAll(() => {
  server = expressConfig([authRoute, inviteRoute, userRoute, organizationRoute]);
});

describe('Testing invite route', () => {
  describe('[POST] /invite/createUser', () => {
    it('Creates invite and gets it', async () => {
      const createUserData: CreateUserDto = {
        username: 'test123',
        password: 'test123',
        email: 'test@test.com',
      };

      const user = await request(server).post('/auth/register').send(createUserData);

      const createOrganizationData: CreateOrganizationDto = { name: 'testOrg' };

      const organization = await request(server)
        .post('/organization')
        .set('authorization', 'Bearer ' + user.body.accessToken)
        .send(createOrganizationData);

      const inviteCreateData: CreateInviteDto = {
        organizationId: organization.body.id,
        expirationDate: Date.now(),
      };

      const invite = await request(server)
        .post('/invite')
        .set('authorization', 'Bearer ' + user.body.accessToken)
        .send(inviteCreateData);

      const getInvite = await request(server)
        .get(`/invite/${invite.body.id}`)
        .set('authorization', 'Bearer ' + user.body.accessToken);

      expect(getInvite.body.id).toEqual(invite.body.id);
      expect(getInvite.body.disabled).toEqual(invite.body.disabled);
      expect(getInvite.body.dateCreated).toEqual(invite.body.dateCreated);
      expect(getInvite.body.expirationDate).toEqual(invite.body.expirationDate);
      expect(getInvite.body.organizationId).toEqual(invite.body.organizationId);
    });
  });

  describe('[GET] /invite/organization/:organizationId', () => {
    it('Creates lots of invites and gets all', async () => {
      const createUserData: CreateUserDto = {
        username: 'test123',
        password: 'test123',
        email: 'test@test.com',
      };

      const user = await request(server).post('/auth/register').send(createUserData);

      const createOrganizationData: CreateOrganizationDto = { name: 'testOrg' };

      const organization = await request(server)
        .post('/organization')
        .set('authorization', 'Bearer ' + user.body.accessToken)
        .send(createOrganizationData);

      for (let i = 0; i < 10; i++) {
        const inviteCreateData: CreateInviteDto = {
          organizationId: organization.body.id,
          expirationDate: Date.now(),
        };

        await request(server)
          .post('/invite')
          .set('authorization', 'Bearer ' + user.body.accessToken)
          .send(inviteCreateData);
      }

      const invites = await request(server)
        .get(`/invite/organization/${organization.body.id}`)
        .set('authorization', 'Bearer ' + user.body.accessToken);

      expect(invites.status).toEqual(200);
      expect(invites.body.length).toEqual(10);
      expect(invites.body[5].id).toBeDefined();
      expect(invites.body[5].disabled).toBeDefined();
      expect(invites.body[5].dateCreated).toBeDefined();
      expect(invites.body[5].expirationDate).toBeDefined();
      expect(invites.body[5].organizationId).toBeDefined();
    });
  });

  describe('[POST] /invite/createUser', () => {
    it('Creates user with invite link and adds to organization', async () => {
      const createUserData: CreateUserDto = {
        username: 'test123',
        password: 'test123',
        email: 'test@test.com',
      };

      const user = await request(server).post('/auth/register').send(createUserData);

      const createOrganizationData: CreateOrganizationDto = { name: 'testOrg' };

      const organization = await request(server)
        .post('/organization')
        .set('authorization', 'Bearer ' + user.body.accessToken)
        .send(createOrganizationData);

      const inviteCreateData: CreateInviteDto = {
        organizationId: organization.body.id,
        expirationDate: Date.now(),
      };

      const invite = await request(server)
        .post('/invite')
        .set('authorization', 'Bearer ' + user.body.accessToken)
        .send(inviteCreateData);

      const createInvitedUserData: CreateInvitedUserDto = {
        email: 'test2@test.com',
        username: 'test2',
        password: 'test123',
        inviteId: invite.body.id,
      };

      const response = await request(server)
        .post('/invite/createUser')
        .set('authorization', 'Bearer ' + user.body.accessToken)
        .send(createInvitedUserData);

      expect(response.status).toEqual(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.username).toBeDefined();
      expect(response.body.email).toBeDefined();

      const organizationResponse = await request(server)
        .get(`/organization/${organization.body.id}`)
        .set('authorization', 'Bearer ' + user.body.accessToken);

      expect(organizationResponse.body.users.length).toEqual(2);
    });
  });

  describe('[POST] /invite/addUser', () => {
    it('User joins with invite link', async () => {
      const createUserData: CreateUserDto = {
        username: 'test123',
        password: 'test123',
        email: 'test@test.com',
      };

      const user = await request(server).post('/auth/register').send(createUserData);

      const createOrganizationData: CreateOrganizationDto = { name: 'testOrg' };

      const organization = await request(server)
        .post('/organization')
        .set('authorization', 'Bearer ' + user.body.accessToken)
        .send(createOrganizationData);

      const inviteCreateData: CreateInviteDto = {
        organizationId: organization.body.id,
        expirationDate: Date.now(),
      };

      const invite = await request(server)
        .post('/invite')
        .set('authorization', 'Bearer ' + user.body.accessToken)
        .send(inviteCreateData);

      const createUser2Data: CreateUserDto = {
        username: 'test222',
        password: 'test123',
        email: 'test2@test.com',
      };

      const user2 = await request(server).post('/auth/register').send(createUser2Data);

      const addUserFromInviteData: AddUserFromInviteDto = { inviteId: invite.body.id };

      const response = await request(server)
        .post('/invite/addUser')
        .set('authorization', 'Bearer ' + user2.body.accessToken)
        .send(addUserFromInviteData);

      expect(response.status).toEqual(200);

      const organizationResponse = await request(server)
        .get(`/organization/${organization.body.id}`)
        .set('authorization', 'Bearer ' + user.body.accessToken);

      expect(organizationResponse.body.users.length).toEqual(2);
    });
  });

  describe('[PATCH] /invite', () => {
    it('Creates and edits the invite', async () => {
      const createUserData: CreateUserDto = {
        username: 'test123',
        password: 'test123',
        email: 'test@test.com',
      };

      const user = await request(server).post('/auth/register').send(createUserData);

      const createOrganizationData: CreateOrganizationDto = { name: 'testOrg' };

      const organization = await request(server)
        .post('/organization')
        .set('authorization', 'Bearer ' + user.body.accessToken)
        .send(createOrganizationData);

      const inviteCreateData: CreateInviteDto = {
        organizationId: organization.body.id,
        expirationDate: Date.now(),
      };

      const invite = await request(server)
        .post('/invite')
        .set('authorization', 'Bearer ' + user.body.accessToken)
        .send(inviteCreateData);

      const expDate = Date.now();

      const editInviteData: EditInviteDto = {
        id: invite.body.id,
        disabled: true,
        expirationDate: expDate,
      };

      const response = await request(server)
        .patch('/invite')
        .set('Content-Type', 'application/json')
        .set('authorization', 'Bearer ' + user.body.accessToken)
        .send(editInviteData);

      expect(response.status).toEqual(200);
      expect(response.body.disabled).toEqual(true);
      expect(response.body.expirationDate).toEqual(expDate.toString());
    });

    it('Creates and tries to edit the invite unprivileged everyting else is unchanged', async () => {
      const createUserData: CreateUserDto = {
        username: 'test123',
        password: 'test123',
        email: 'test@test.com',
      };

      const user = await request(server).post('/auth/register').send(createUserData);

      const createOrganizationData: CreateOrganizationDto = { name: 'testOrg' };

      const organization = await request(server)
        .post('/organization')
        .set('authorization', 'Bearer ' + user.body.accessToken)
        .send(createOrganizationData);

      const expDateUnchanged = Date.now();

      const inviteCreateData: CreateInviteDto = {
        organizationId: organization.body.id,
        expirationDate: expDateUnchanged,
      };

      const invite = await request(server)
        .post('/invite')
        .set('authorization', 'Bearer ' + user.body.accessToken)
        .send(inviteCreateData);

      const expDate = Date.now();

      const createUser2Data: CreateUserDto = {
        username: 'test222',
        password: 'test123',
        email: 'test2@test.com',
      };

      const user2 = await request(server).post('/auth/register').send(createUser2Data);

      const editInviteData: EditInviteDto = {
        id: invite.body.id,
        disabled: true,
        expirationDate: expDate,
      };

      const response = await request(server)
        .patch('/invite')
        .set('Content-Type', 'application/json')
        .set('authorization', 'Bearer ' + user2.body.accessToken)
        .send(editInviteData);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('Organization not found');

      const getInvite = await request(server)
        .get(`/invite/${invite.body.id}`)
        .set('authorization', 'Bearer ' + user.body.accessToken);

      expect(getInvite.body.disabled).toEqual(false);
      expect(getInvite.body.expirationDate).toEqual(expDateUnchanged.toString());
    });
  });
});
