/*
Copyright (c) 2012 Stencila Ltd

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is 
hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD 
TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. 
IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR 
CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA
OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, 
ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

//! @file dataquery-cxx.hpp
//! @brief Function definitions for C++ embedded query language
//! @author Nokome Bentley

#pragma once

#include "dataquery.hpp"

namespace Stencila {
      
//! @namespace DQL
//! @brief Data Query Langauge for C++
//!
//! Includes several functions for convieniently defining Dataqueries within C++
//! Instead of creating and linking Dataquery elements individually, these functions
//! provide useful shortcuts. For example...
//! @todo Finish this documentation
namespace DQL {

//! @name Expressions
//! @{

Column column(const std::string& name){
      return Column(name);
}


Constant<int> wrap(const int& value){
      return Constant<int>(value);
}
Constant<float> wrap(const float& value){
      return Constant<float>(value);
}
Constant<std::string> wrap(const std::string& value){
      return Constant<std::string>(value);
}
template<class Element>
const Element& wrap(const Element& element){
      return element;
}

template<class Element>
void append(Element& element){
} 
template<class Element,class Expression,class... Expressions>
void append(Element& element,const Expression& expr,const Expressions&... exprs){
      element.append(wrap(expr));
      append(element,exprs...);
} 

//! @}

//! @name Unary operators
//! @{

#define UNOP(name,symbol) \
      template<class Expression> \
      name operator symbol(const Expression& expr){ \
            return name(wrap(expr)); \
      }

UNOP(Positive,+)
UNOP(Negative,-)
UNOP(Not,!)

#undef UNOP

//! @}

//! @name Binary operators
//! @{

#define BINOP(name,symbol) \
      template<class Left,class Right> \
      name operator symbol(const Left& left,const Right& right){ \
            return name(wrap(left),wrap(right)); \
      }

BINOP(Multiply,*)
BINOP(Divide,/)
BINOP(Add,+)
BINOP(Subtract,-)

BINOP(Equal,==)
BINOP(NotEqual,!=)
BINOP(LessThan,<)
BINOP(LessEqual,<=)
BINOP(GreaterThan,>)
BINOP(GreaterEqual,>=)

BINOP(And,&&)
BINOP(Or,||)

#undef BINOP

//! @}

//! @name Function calls
//! @{

#define CALL(name) \
      template<class... Expressions> \
      Call name(const Expressions&... exprs){ \
            Call call(#name); \
            append(call,exprs...); \
            return call; \
      } 

#define CALL_0(name) \
      template<class Expression> \
      Call name(void){ \
            return Call(#name); \
      } 

#define CALL_1(name) \
      template<class Expression> \
      Call name(const Expression& expr){ \
            return Call(#name,wrap(expr)); \
      } 
      
#define CALL_2_M(name) \
      template<class Expression1,class Expression2,class... Expressions> \
      Call name(const Expression1& expr1,const Expression2& expr2,const Expressions&... exprs){ \
            Call call(#name,wrap(expr1),wrap(expr2)); \
            append(call,exprs...); \
            return call; \
      } 
    
#define AGG_1(name) \
      template<class Expression> \
      Aggregate name(const Expression& expr){ \
            return Aggregate(#name,wrap(expr)); \
      } 

//! Number functions
//! See http://www.sqlite.org/lang_corefunc.html
CALL_1(abs)
CALL_2_M(max)
CALL_2_M(min)
CALL_0(random)
CALL_1(round)

// Number aggregate functions
//! See http://www.sqlite.org/lang_aggfunc.html
AGG_1(avg)
AGG_1(count)
AGG_1(max)
AGG_1(min)
AGG_1(sum)
AGG_1(mean)
AGG_1(geomean)
AGG_1(harmean)

// Text functions
//! See http://www.sqlite.org/lang_corefunc.html
CALL_1(length)
CALL_1(lower)
CALL_1(upper)
CALL_1(trim)
CALL_1(ltrim)
CALL_1(rtrim)
CALL(replace)
CALL(substr)

// Date and time functions
//! See http://www.sqlite.org/lang_datefunc.html
template<class Format, class Expression, class Modifier>
Call strftime(const Format& format,const Expression& expr, const Modifier& modifier){
      return Call("strftime",wrap(format),wrap(expr),wrap(modifier));
} 

#undef CALL_0
#undef CALL_1

//! @}

const Distinct distinct;
const All all;

template<class Expression>
Where where(const Expression& expr){
      return Where(wrap(expr));
}

template<class Expression>
By by(const Expression& expr){
      return By(wrap(expr));
}

template<class Expression>
Having having(const Expression& expr){
      return Having(wrap(expr));
}

template<class Expression>
Order order(const Expression& expr, float direction = 1){
      return Order(wrap(expr),direction);
}

template<class Expression>
Limit limit(const Expression& expr){
      return Limit(wrap(expr));
}

template<class Expression>
Offset offset(const Expression& expr){
      return Offset(wrap(expr));
}

template<class Element,class Expression>
Top top(const Element& element,const Expression& expression,unsigned int num){
      return Top(wrap(element),wrap(expression),num);
}

}
}
