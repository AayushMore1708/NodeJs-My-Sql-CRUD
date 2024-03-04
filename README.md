download
nodejs 
mysql
git

npm install express mysql2 cors

CREATE USER 'Aayush'@'%' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON Stud.* TO 'Aayush'@'%';
FLUSH PRIVILEGES;

create table students
(Name varchar(10),RollNo int);

insert into students
values("Aayush",1);

insert into students
values("Hrutesh",2);

