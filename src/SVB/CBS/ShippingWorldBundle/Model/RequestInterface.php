<?php
namespace SVB\CBS\ShippingWorldBundle\Model;
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 23.09.15
 * Time: 16:33
 */
interface RequestInterface extends MessageContentInterface
{

    /**
     * @return ServiceInterface
     */
    public function getServiceRequested();

}